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

// ---------- fetch & store ----------

await mkdir(DATA_DIR, { recursive: true });

const months = new Map();
for (const ym of FETCH_MONTHS) months.set(ym, await loadMonth(ym));

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
for (const [ym, file] of months) {
  file.fetchedAt = fetchedAt;
  await writeFile(
    path.join(DATA_DIR, `${ym}.json`),
    JSON.stringify(file, null, 2) + '\n'
  );
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
  L.push(
    '<details>',
    `<summary>Daily downloads — ${m.month}</summary>`,
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
    `wrote ${FETCH_MONTHS.map((ym) => `data/${ym}.json`).join(', ')} + DASHBOARD.md`
);
for (const r of results.filter((r) => r.error)) {
  console.error(`  ! ${r.pkg}: ${r.error}`);
}
