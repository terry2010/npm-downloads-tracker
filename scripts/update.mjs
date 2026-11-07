#!/usr/bin/env node
// Fetches daily npm download counts for the packages in packages.json,
// stores them under data/YYYY-MM.json and regenerates DASHBOARD.md.
// Covers the previous month and the current month (through today) in one
// range query per package, so missed runs self-heal on the next run.

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'data');
const CHARTS_DIR = path.join(ROOT, 'charts');
const DASHBOARD_PATH = path.join(ROOT, 'DASHBOARD.md');
const PACKAGES = JSON.parse(await readFile(path.join(ROOT, 'packages.json'), 'utf8'));

const now = new Date();
const today = now.toISOString().slice(0, 10);
const currentYm = today.slice(0, 7);
const [cy, cm] = currentYm.split('-').map(Number);
const prevYm = new Date(Date.UTC(cy, cm - 2, 1)).toISOString().slice(0, 7);
const rangeStart = `${prevYm}-01`;
const FETCH_MONTHS = [prevYm, currentYm];

const nf = new Intl.NumberFormat('en-US');
const BARS = '▁▂▃▄▅▆▇█';
const PALETTE = [
  '#4C78A8',
  '#F58518',
  '#54A24B',
  '#E45756',
  '#72B7B2',
  '#B279A2',
  '#FF9DA6',
  '#9D755D',
  '#BAB0AC',
];
const dHeaders = ['Date', ...PACKAGES.map((p) => `\`${p}\``), 'Total'];

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
    f.errors ??= {};
    return f;
  } catch {
    return { month: ym, fetchedAt: null, packages: {}, errors: {} };
  }
}

async function fetchRange(pkg) {
  const url = `https://api.npmjs.org/downloads/range/${rangeStart}:${today}/${pkg}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'npm-downloads-tracker (github-actions)',
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  if (!Array.isArray(body.downloads)) throw new Error('unexpected response shape');
  return body.downloads;
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
    for (const pkg of PACKAGES) {
      const map = file?.packages?.[pkg];
      if (!map || file?.errors?.[pkg]) {
        cells.push('—');
        continue;
      }
      const v = map[date] ?? 0;
      total += v;
      cells.push(fmt(v));
    }
    cells.push(fmt(total));
    return cells;
  });
}

const CHART_W = 960;
const CHART_H = 340;

function niceCeil(v) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

function fmtTick(v) {
  return Number.isInteger(v) ? nf.format(v) : String(parseFloat(v.toFixed(2)));
}

function renderChart(file, days) {
  const left = 48;
  const right = 16;
  const top = 34;
  const bottom = 30;
  const pw = CHART_W - left - right;
  const ph = CHART_H - top - bottom;
  const n = days.length;
  const r1 = (v) => Math.round(v * 10) / 10;

  const series = [];
  PACKAGES.forEach((pkg, i) => {
    const map = file?.packages?.[pkg];
    if (!map || file?.errors?.[pkg]) return;
    series.push({
      name: pkg,
      color: PALETTE[i % PALETTE.length],
      vals: days.map((d) => map[d] ?? 0),
    });
  });

  const maxV = niceCeil(Math.max(0, ...series.flatMap((s) => s.vals)));
  const xAt = (i) => (n === 1 ? left + pw / 2 : left + (i / (n - 1)) * pw);
  const yAt = (v) => top + ph - (v / maxV) * ph;

  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CHART_W} ${CHART_H}" role="img">`,
    `<title>Daily npm downloads — ${file.month}</title>`,
    '<style>',
    '.bg{fill:#fff}.grid{stroke:#e5e7eb;stroke-width:1}.base{stroke:#d0d7de}.lbl{fill:#57606a;font:10px -apple-system,"Segoe UI",sans-serif}',
    '@media (prefers-color-scheme:dark){.bg{fill:#0d1117}.grid{stroke:#30363d}.base{stroke:#484f58}.lbl{fill:#8b949e}}',
    '</style>',
    `<rect class="bg" width="${CHART_W}" height="${CHART_H}" rx="8"/>`,
  ];

  let lx = left;
  for (const s of series) {
    parts.push(
      `<line x1="${r1(lx)}" y1="16" x2="${r1(lx + 14)}" y2="16" stroke="${s.color}" stroke-width="2.5"/>`,
      `<text class="lbl" x="${r1(lx + 18)}" y="19.5">${s.name}</text>`
    );
    lx += 36 + s.name.length * 6;
  }

  for (let k = 0; k <= 4; k++) {
    const v = (maxV * k) / 4;
    const y = r1(yAt(v));
    parts.push(
      `<line class="${k === 0 ? 'base' : 'grid'}" x1="${left}" y1="${y}" x2="${left + pw}" y2="${y}"/>`,
      `<text class="lbl" x="${left - 8}" y="${r1(y + 3.5)}" text-anchor="end">${fmtTick(v)}</text>`
    );
  }

  const xIdx = [
    ...new Set(
      Array.from({ length: 6 }, (_, i) => Math.round((i * (n - 1)) / 5))
    ),
  ];
  for (const idx of xIdx) {
    parts.push(
      `<text class="lbl" x="${r1(xAt(idx))}" y="${CHART_H - 8}" text-anchor="middle">${days[idx].slice(5)}</text>`
    );
  }

  for (const s of series) {
    const pts = s.vals.map((v, i) => `${r1(xAt(i))},${r1(yAt(v))}`).join(' ');
    parts.push(
      `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`
    );
    s.vals.forEach((v, i) => {
      parts.push(
        `<circle cx="${r1(xAt(i))}" cy="${r1(yAt(v))}" r="2.2" fill="${s.color}"/>`
      );
    });
  }

  if (!series.length) {
    parts.push(
      `<text class="lbl" x="${CHART_W / 2}" y="${CHART_H / 2}" text-anchor="middle">no data</text>`
    );
  }

  parts.push('</svg>');
  return parts.join('\n');
}

// ---------- fetch & store ----------

await mkdir(DATA_DIR, { recursive: true });
await mkdir(CHARTS_DIR, { recursive: true });

const months = new Map();
const snapshots = new Map();
for (const ym of FETCH_MONTHS) {
  const f = await loadMonth(ym);
  months.set(ym, f);
  snapshots.set(ym, {
    packages: structuredClone(f.packages),
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

const fetchedAt = new Date().toISOString();
const touched = [];
for (const [ym, file] of months) {
  const snap = snapshots.get(ym);
  const changed =
    stable(snap.packages) !== stable(file.packages) ||
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
      sumRows.push([name, '—', '—', '—', '—', '—']);
      continue;
    }
    const vals = days.map((d) => map[d] ?? 0);
    const total = vals.reduce((a, b) => a + b, 0);
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

  const chartRel = `charts/${currentYm}.svg`;
  await writeFile(path.join(ROOT, chartRel), renderChart(cur, days));
  L.push(`![Daily downloads — ${currentYm}](${chartRel})`, '');

  L.push(`### Daily — ${currentYm}`, '', ...mdTable(dHeaders, dailyRows(cur, days, true)), '');
}

L.push('## Monthly history', '');
const hHeaders = ['Month', ...PACKAGES.map((p) => `\`${p}\``), 'Grand total'];
const hRows = allMonths.map((m) => {
  const cells = [m.month === currentYm ? `${m.month} (MTD)` : m.month];
  let grand = 0;
  for (const pkg of PACKAGES) {
    const t = monthTotal(m, pkg);
    if (t === null) {
      cells.push('—');
      continue;
    }
    grand += t;
    cells.push(fmt(t));
  }
  cells.push(fmt(grand));
  return cells;
});
L.push(...mdTable(hHeaders, hRows), '');

const past = allMonths
  .filter((m) => m.month !== currentYm)
  .sort((a, b) => b.month.localeCompare(a.month));
for (const m of past) {
  const chartRel = `charts/${m.month}.svg`;
  await writeFile(path.join(ROOT, chartRel), renderChart(m, daysOf(m.month)));
  L.push(
    '<details>',
    `<summary>Daily downloads — ${m.month}</summary>`,
    '',
    `![Daily downloads — ${m.month}](${chartRel})`,
    '',
    ...mdTable(dHeaders, dailyRows(m, daysOf(m.month))),
    '',
    '</details>',
    ''
  );
}

L.push('---', '', '_Generated by `scripts/update.mjs` — raw data in `data/`_');
await writeFile(DASHBOARD_PATH, L.join('\n') + '\n');

console.log(
  `fetched ${results.filter((r) => !r.error).length}/${PACKAGES.length} packages; ` +
    (touched.length ? `wrote ${touched.join(', ')}` : 'no data changes') +
    ' + DASHBOARD.md'
);
for (const r of results.filter((r) => r.error)) {
  console.error(`  ! ${r.pkg}: ${r.error}`);
}
