#!/usr/bin/env node
// Fetches daily npm download counts for the packages in packages.json,
// stores them under data/YYYY-MM.json and regenerates DASHBOARD.md.
// Covers the previous month and the current month (through today) in one
// range query per package, so missed runs self-heal on the next run.

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execFileP = promisify(execFile);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'data');
const DASHBOARD_PATH = path.join(ROOT, 'DASHBOARD.md');
const PACKAGES = JSON.parse(await readFile(path.join(ROOT, 'packages.json'), 'utf8'));
const DOCKER_IMAGES = JSON.parse(
  await readFile(path.join(ROOT, 'docker.json'), 'utf8').catch(() => '[]')
);

const now = new Date();
const today = now.toISOString().slice(0, 10);
const currentYm = today.slice(0, 7);
const [cy, cm] = currentYm.split('-').map(Number);
const prevYm = new Date(Date.UTC(cy, cm - 2, 1)).toISOString().slice(0, 7);
const rangeStart = `${prevYm}-01`;
const FETCH_MONTHS = [prevYm, currentYm];

// Every `npm publish` triggers ~150 automated tarball fetches on that day
// (security scanners, registry mirrors, crawlers). "Est. real" subtracts
// this estimated wave — it's an upper bound on organic installs, since
// ambient crawlers and CI traffic can't be separated out.
const BOT_PER_PUBLISH = 150;

const nf = new Intl.NumberFormat('en-US');
const BARS = '▁▂▃▄▅▆▇█';
const dHeaders = ['Date', ...PACKAGES.map((p) => `\`${p}\``), 'Total', 'Est. real'];
const dockerHeaders = ['Date', ...DOCKER_IMAGES.map((i) => `\`${i}\``), 'Total'];

function lastDayOf(ym) {
  const [y, m] = ym.split('-').map(Number);
  return new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
}

function daysOf(ym, end) {
  const last = !end || end > lastDayOf(ym) ? lastDayOf(ym) : end;
  const days = [];
  for (let t = Date.parse(`${ym}-01T00:00:00Z`); ; t += 86400000) {
    const d = new Date(t).toISOString().slice(0, 10);
    if (d > last) break;
    days.push(d);
  }
  return days;
}

function sparkline(values) {
  const max = Math.max(0, ...values);
  if (max === 0) return BARS[0].repeat(values.length);
  return values
    .map((v) => BARS[Math.min(BARS.length - 1, Math.floor((v / max) * BARS.length))])
    .join('');
}

function stable(value) {
  return JSON.stringify(value, (_, x) =>
    x && typeof x === 'object' && !Array.isArray(x)
      ? Object.fromEntries(
          Object.entries(x).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        )
      : x
  );
}

function mdTable(headers, rows) {
  const lines = [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map((_, i) => (i === 0 ? '---' : '---:')).join(' | ')} |`,
  ];
  for (const r of rows) lines.push(`| ${r.join(' | ')} |`);
  return lines;
}

function fmt(v) {
  return nf.format(v);
}

async function loadMonth(ym) {
  try {
    const f = JSON.parse(await readFile(path.join(DATA_DIR, `${ym}.json`), 'utf8'));
    f.month = ym;
    f.packages ??= {};
    f.docker ??= {};
    f.errors ??= {};
    return f;
  } catch {
    return { month: ym, fetchedAt: null, packages: {}, docker: {}, errors: {} };
  }
}

// node:fetch ignores HTTP(S)_PROXY env vars; on networks that need a proxy
// (e.g. where Docker Hub's DNS is poisoned) fall back to curl, which honors
// them. Used only when a proxy is configured AND the direct fetch failed.
const PROXY_SET = !!(
  process.env.HTTPS_PROXY ??
  process.env.https_proxy ??
  process.env.HTTP_PROXY ??
  process.env.http_proxy
);

async function fetchJson(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'npm-downloads-tracker (github-actions)',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (!PROXY_SET) throw err;
    try {
      const { stdout } = await execFileP('curl', [
        '-sf',
        '-H',
        'Accept: application/json',
        '--max-time',
        '30',
        url,
      ]);
      return JSON.parse(stdout);
    } catch {
      throw err;
    }
  }
}

async function fetchRange(pkg) {
  const url = `https://api.npmjs.org/downloads/range/${rangeStart}:${today}/${pkg}`;
  const body = await fetchJson(url);
  if (!Array.isArray(body.downloads)) throw new Error('unexpected response shape');
  return body.downloads;
}

// Counts how many versions were published each UTC day, from the
// packument's `time` map (version -> publish timestamp).
async function fetchPublishDays(pkg) {
  const body = await fetchJson(`https://registry.npmjs.org/${pkg}`);
  const counts = {};
  for (const [k, t] of Object.entries(body.time ?? {})) {
    if (k === 'created' || k === 'modified') continue;
    const d = String(t).slice(0, 10);
    counts[d] = (counts[d] ?? 0) + 1;
  }
  return counts;
}

const pubDaysByPkg = {};
function estReal(pkg, v, date) {
  return Math.max(0, v - BOT_PER_PUBLISH * (pubDaysByPkg[pkg]?.[date] ?? 0));
}

// Docker Hub exposes only a cumulative pull_count per repo — we snapshot it
// once per run and derive daily pulls by diffing consecutive snapshots.
async function fetchDockerPulls(image) {
  const body = await fetchJson(
    `https://hub.docker.com/v2/repositories/${image}/`
  );
  if (typeof body.pull_count !== 'number')
    throw new Error('unexpected response shape');
  return body.pull_count;
}

const DAY_MS = 86400000;

// Per-day pull deltas for an image, from the merged snapshot series across
// all month files. Gaps (missed runs) are spread evenly and marked approx.
function dockerDeltaMap(series) {
  const dates = Object.keys(series).sort();
  const deltas = new Map();
  for (let i = 1; i < dates.length; i++) {
    const prev = Date.parse(dates[i - 1]);
    const cur = Date.parse(dates[i]);
    const gap = Math.round((cur - prev) / DAY_MS);
    const diff = series[dates[i]] - series[dates[i - 1]];
    if (gap <= 1) {
      deltas.set(dates[i], { v: diff });
    } else {
      const per = Math.round(diff / gap);
      for (let t = prev + DAY_MS; t <= cur; t += DAY_MS) {
        deltas.set(new Date(t).toISOString().slice(0, 10), {
          v: per,
          approx: true,
        });
      }
    }
  }
  return deltas;
}

function monthCell(file, pkg, date) {
  const map = file?.packages?.[pkg];
  if (!map || file?.errors?.[pkg]) return '—';
  return fmt(map[date] ?? 0);
}

function monthTotal(file, pkg) {
  const map = file?.packages?.[pkg];
  if (!map || file?.errors?.[pkg]) return null;
  return Object.values(map).reduce((a, b) => a + b, 0);
}

function dailyRows(file, days, boldToday = false) {
  return days.map((date) => {
    const cells = [boldToday && date === today ? `**${date}**` : date];
    let total = 0;
    let est = 0;
    let any = false;
    for (const pkg of PACKAGES) {
      const map = file?.packages?.[pkg];
      if (!map || file?.errors?.[pkg]) {
        cells.push('—');
        continue;
      }
      const v = map[date] ?? 0;
      total += v;
      est += estReal(pkg, v, date);
      any = true;
      cells.push(fmt(v));
    }
    cells.push(fmt(total), any ? fmt(est) : '—');
    return cells;
  });
}

function niceCeil(v) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

function renderMermaid(file, days) {
  const series = [];
  PACKAGES.forEach((pkg) => {
    const map = file?.packages?.[pkg];
    if (!map || file?.errors?.[pkg]) return;
    series.push({ name: pkg, vals: days.map((d) => map[d] ?? 0) });
  });
  if (!series.length) return null;

  const maxV = niceCeil(Math.max(0, ...series.flatMap((s) => s.vals)));
  const xLabels = days.map((d) => `"${Number(d.slice(8))}"`).join(', ');
  const lines = series.map(
    (s) => `    line "${s.name}" [${s.vals.join(', ')}]`
  );

  return [
    '```mermaid',
    "%%{init: {'xyChart': {'width': 960, 'height': 320}}}%%",
    'xychart-beta',
    `    title "Daily downloads - ${file.month}"`,
    `    x-axis [${xLabels}]`,
    `    y-axis "downloads" 0 --> ${maxV}`,
    ...lines,
    '```',
  ].join('\n');
}

// ---------- fetch & store ----------

await mkdir(DATA_DIR, { recursive: true });

const months = new Map();
const snapshots = new Map();
for (const ym of FETCH_MONTHS) {
  const f = await loadMonth(ym);
  months.set(ym, f);
  snapshots.set(ym, {
    packages: structuredClone(f.packages),
    docker: structuredClone(f.docker ?? {}),
    errors: structuredClone(f.errors ?? {}),
  });
}

const results = await Promise.all(
  PACKAGES.map(async (pkg) => {
    try {
      return { pkg, rows: await fetchRange(pkg) };
    } catch (err) {
      return { pkg, error: String(err?.message ?? err) };
    }
  })
);

const pubResults = await Promise.all(
  PACKAGES.map(async (pkg) => {
    try {
      return { pkg, days: await fetchPublishDays(pkg) };
    } catch (err) {
      return { pkg, error: String(err?.message ?? err) };
    }
  })
);
for (const r of pubResults) {
  if (r.error) console.error(`  ! publish-days ${r.pkg}: ${r.error}`);
  else pubDaysByPkg[r.pkg] = r.days;
}

for (const { pkg, rows, error } of results) {
  for (const ym of FETCH_MONTHS) {
    const file = months.get(ym);
    if (error) {
      file.errors = { ...(file.errors ?? {}), [pkg]: error };
      continue;
    }
    const map = {};
    for (const d of rows) {
      if (d.day.startsWith(ym)) map[d.day] = d.downloads;
    }
    file.packages[pkg] = map;
    if (file.errors) delete file.errors[pkg];
  }
}

const dockerResults = await Promise.all(
  DOCKER_IMAGES.map(async (image) => {
    try {
      return { image, pulls: await fetchDockerPulls(image) };
    } catch (err) {
      return { image, error: String(err?.message ?? err) };
    }
  })
);
{
  const file = months.get(currentYm);
  for (const { image, pulls, error } of dockerResults) {
    if (error) {
      file.errors = { ...(file.errors ?? {}), [`docker:${image}`]: error };
      continue;
    }
    (file.docker ??= {})[image] = {
      ...(file.docker[image] ?? {}),
      [today]: pulls,
    };
    if (file.errors) delete file.errors[`docker:${image}`];
  }
}

const fetchedAt = new Date().toISOString();
const touched = [];
for (const [ym, file] of months) {
  const snap = snapshots.get(ym);
  const changed =
    stable(snap.packages) !== stable(file.packages) ||
    stable(snap.docker ?? {}) !== stable(file.docker ?? {}) ||
    stable(snap.errors ?? {}) !== stable(file.errors ?? {});
  if (!changed && file.fetchedAt) continue;
  file.fetchedAt = fetchedAt;
  await writeFile(
    path.join(DATA_DIR, `${ym}.json`),
    JSON.stringify(file, null, 2) + '\n'
  );
  touched.push(`data/${ym}.json`);
}

// ---------- dashboard ----------

const files = (await readdir(DATA_DIR))
  .filter((f) => /^\d{4}-\d{2}\.json$/.test(f))
  .sort();
const allMonths = [];
for (const f of files) {
  allMonths.push(JSON.parse(await readFile(path.join(DATA_DIR, f), 'utf8')));
}
allMonths.sort((a, b) => a.month.localeCompare(b.month));

// Merged cumulative pull_count series per image across all month files.
const dSeries = {};
const dDeltas = {};
for (const m of allMonths) {
  for (const [im, map] of Object.entries(m.docker ?? {})) {
    Object.assign((dSeries[im] ??= {}), map);
  }
}
for (const im of DOCKER_IMAGES) {
  dDeltas[im] = dockerDeltaMap(dSeries[im] ?? {});
}

function dockerDailyRows(m, days) {
  return days.map((date) => {
    const cells = [date === today ? `**${date}**` : date];
    let total = 0;
    let any = false;
    for (const im of DOCKER_IMAGES) {
      const d = dDeltas[im].get(date);
      if (!d || m.errors?.[`docker:${im}`]) {
        cells.push('—');
        continue;
      }
      total += d.v;
      any = true;
      cells.push((d.approx ? '≈' : '') + fmt(d.v));
    }
    cells.push(any ? fmt(total) : '—');
    return cells;
  });
}

const L = [];
L.push('# NPM Downloads Tracker', '');
L.push(
  'Daily download counts for watched npm packages, fetched every morning (00:00 UTC / 08:00 Beijing time) by GitHub Actions.',
  ''
);

const lastFetch = allMonths.map((m) => m.fetchedAt).filter(Boolean).sort().pop();
if (lastFetch) {
  const d = new Date(lastFetch);
  L.push(`_Last updated: ${d.toISOString().slice(0, 16).replace('T', ' ')} UTC_`, '');
}

L.push('## Watched packages', '');
for (const p of PACKAGES) L.push(`- \`${p}\``);
L.push('');

const cur = allMonths.find((m) => m.month === currentYm);
if (!cur) {
  L.push(`## ${currentYm}`, '', 'No data yet — run `npm run update`.', '');
} else {
  const days = daysOf(currentYm, today);
  L.push(`## ${currentYm} — month to date`, '');

  const sumHeaders = [
    'Package',
    'Total',
    'Est. real',
    'Avg/day',
    'Peak',
    'Today',
    'Trend',
  ];
  const sumRows = [];
  for (const pkg of PACKAGES) {
    const map = cur.packages?.[pkg];
    const name = `\`${pkg}\``;
    if (!map || cur.errors?.[pkg]) {
      sumRows.push([name, '—', '—', '—', '—', '—', '—']);
      continue;
    }
    const vals = days.map((d) => map[d] ?? 0);
    const total = vals.reduce((a, b) => a + b, 0);
    const estTotal = vals.reduce((a, v, i) => a + estReal(pkg, v, days[i]), 0);
    let peak = 0;
    let peakDay = '';
    vals.forEach((v, i) => {
      if (v > peak) {
        peak = v;
        peakDay = days[i];
      }
    });
    sumRows.push([
      name,
      fmt(total),
      fmt(estTotal),
      (total / days.length).toFixed(1),
      `${fmt(peak)} · ${peakDay.slice(5)}`,
      fmt(vals[vals.length - 1] ?? 0),
      sparkline(vals),
    ]);
  }
  L.push(...mdTable(sumHeaders, sumRows), '');

  const errs = Object.entries(cur.errors ?? {});
  if (errs.length) {
    L.push(
      `> Fetch errors: ${errs.map(([p, e]) => `\`${p}\`: ${e}`).join(' · ')}`,
      ''
    );
  }

  L.push(
    `> \`Est. real\` subtracts ~${BOT_PER_PUBLISH} automated downloads per version published that day — every \`npm publish\` triggers a scanner/mirror fetch wave. It's an upper bound on organic installs (ambient crawlers and CI can't be separated).`,
    ''
  );

  const mm = renderMermaid(cur, days);
  if (mm) L.push(mm, '');

  L.push(`### Daily — ${currentYm}`, '', ...mdTable(dHeaders, dailyRows(cur, days, true)), '');

  if (DOCKER_IMAGES.length) {
    L.push('## Docker Hub pulls', '');
    const imRows = [];
    for (const im of DOCKER_IMAGES) {
      const series = dSeries[im] ?? {};
      const dates = Object.keys(series).sort();
      const deltas = dDeltas[im];
      const name = `\`${im}\``;
      if (!dates.length || cur.errors?.[`docker:${im}`]) {
        imRows.push([name, '—', '—', '—', '—']);
        continue;
      }
      const vals = days.map((d) => deltas.get(d)?.v ?? 0);
      const mtd = vals.reduce((a, b) => a + b, 0);
      const tv = deltas.get(today);
      imRows.push([
        name,
        fmt(series[dates[dates.length - 1]]),
        dates.length > 1 ? fmt(mtd) : '—',
        tv ? (tv.approx ? '≈' : '') + fmt(tv.v) : '—',
        sparkline(vals),
      ]);
    }
    L.push(
      ...mdTable(
        ['Image', 'All-time pulls', `${currentYm} est.`, 'Today', 'Trend'],
        imRows
      ),
      ''
    );
    L.push(
      '> Docker Hub only exposes a cumulative `pull_count` — daily figures are diffs between once-a-day snapshots, so they lag ~1 day. `≈` marks days inside a missed-run gap (delta spread evenly). Same bot-wave caveat as npm: new tags get pulled by image scanners.',
      ''
    );
    L.push(
      `### Daily pulls — ${currentYm}`,
      '',
      ...mdTable(dockerHeaders, dockerDailyRows(cur, days)),
      ''
    );
  }
}

L.push('## Monthly history', '');
const hHeaders = ['Month', ...PACKAGES.map((p) => `\`${p}\``), 'Grand total', 'Est. real'];
const hRows = allMonths.map((m) => {
  const cells = [m.month === currentYm ? `${m.month} (MTD)` : m.month];
  let grand = 0;
  let est = 0;
  for (const pkg of PACKAGES) {
    const t = monthTotal(m, pkg);
    if (t === null) {
      cells.push('—');
      continue;
    }
    grand += t;
    for (const [d, v] of Object.entries(m.packages[pkg])) {
      est += estReal(pkg, v, d);
    }
    cells.push(fmt(t));
  }
  cells.push(fmt(grand), fmt(est));
  return cells;
});
L.push(...mdTable(hHeaders, hRows), '');

const past = allMonths
  .filter((m) => m.month !== currentYm)
  .sort((a, b) => b.month.localeCompare(a.month));
for (const m of past) {
  const mDays = daysOf(m.month);
  const mm = renderMermaid(m, mDays);
  const hasDocker = DOCKER_IMAGES.some(
    (im) => Object.keys(m.docker?.[im] ?? {}).length
  );
  L.push(
    '<details>',
    `<summary>Daily downloads — ${m.month}</summary>`,
    '',
    ...(mm ? [mm, ''] : []),
    ...mdTable(dHeaders, dailyRows(m, mDays)),
    '',
    ...(hasDocker
      ? [
          '#### Docker Hub pulls',
          '',
          ...mdTable(dockerHeaders, dockerDailyRows(m, mDays)),
          '',
        ]
      : []),
    '</details>',
    ''
  );
}

L.push('---', '', '_Generated by `scripts/update.mjs` — raw data in `data/`_');
await writeFile(DASHBOARD_PATH, L.join('\n') + '\n');

console.log(
  `fetched ${results.filter((r) => !r.error).length}/${PACKAGES.length} packages` +
    (DOCKER_IMAGES.length
      ? ` + ${dockerResults.filter((r) => !r.error).length}/${DOCKER_IMAGES.length} docker images`
      : '') +
    '; ' +
    (touched.length ? `wrote ${touched.join(', ')}` : 'no data changes') +
    ' + DASHBOARD.md'
);
for (const r of results.filter((r) => r.error)) {
  console.error(`  ! ${r.pkg}: ${r.error}`);
}
for (const r of dockerResults.filter((r) => r.error)) {
  console.error(`  ! docker:${r.image}: ${r.error}`);
}
