# npm-downloads-tracker

Tracks daily [npm](https://www.npmjs.com/) download counts for a watchlist of packages. Data is fetched every morning by GitHub Actions and rendered as a markdown dashboard.

Dashboard: [DASHBOARD.md](DASHBOARD.md)

## Watched packages

- `dsh-loop-recover`
- `dsh-rss-news-daily`
- `opencode-loop-recover`
- `oc-market-quail-zephyr-72a0`
- `awesome-opencode-market`
- `surfbird`
- `surfbird-mcp`

Watched Docker Hub images:

- `terry2010/surfbird`
- `terry2010/chrome-headless-chinese`
- `terry2010/gojieba-api`
- `terry2010/simple-chrome-spider`

To change the watchlists, edit `config.json`:

```json
{
  "npm": ["package-name", "..."],
  "docker": ["namespace/image", "..."]
}
```

(The legacy `packages.json` / `docker.json` pair is still read as a fallback when `config.json` is absent.)

## How it works

- `.github/workflows/daily.yml` runs `scripts/update.mjs` daily at 00:00 UTC (08:00 Beijing time), plus on-demand via `workflow_dispatch`.
- npm often leaves recent days at 0 or missing, then backfills them in batches days later. Every run re-fetches the whole previous-month + current-month-to-date range per package (`https://api.npmjs.org/downloads/range/<prev-month-01>:<today>/<pkg>`), so corrections are picked up automatically on the next run.
- Data files are only rewritten when numbers actually change, so the repo stays quiet while npm has nothing new. `DASHBOARD.md`'s "Last updated" reflects the last real data change.
- Results are stored in `data/YYYY-MM.json` (sparse `date -> downloads` maps per package), a mermaid `xychart-beta` line chart per month is embedded in `DASHBOARD.md`, which is regenerated alongside.
- Every `npm publish` triggers ~150 automated tarball fetches on that day (security scanners, registry mirrors, crawlers). The script also fetches each package's publish dates from the registry and reports an `Est. real` column = downloads minus ~150 per version published that day. It's an upper bound on organic installs — ambient crawlers, mirrors and CI can't be separated by the public API.
- Docker Hub has no per-day pull API — only a cumulative `pull_count` per repo (`https://hub.docker.com/v2/repositories/<ns>/<img>/`). Each run snapshots it into `data/YYYY-MM.json` under `docker`, and daily pulls are derived by diffing consecutive snapshots (so they lag ~1 day). Days inside a missed-run gap get the delta spread evenly and are marked `≈`. For a repo registered within ~2 months of the first snapshot, the baseline count is spread over the days since `date_registered` (marked `≈`) instead of being dropped; older repos stay baseline-only since their history can't be attributed.
- If `HTTP(S)_PROXY` env vars are set and a fetch fails (e.g. Docker Hub's DNS is poisoned on some networks), the script retries via `curl`, which honors the proxy.

## Commands

```bash
npm run update   # fetch latest data and rebuild the dashboard
```

## Notes

- "Today" (snapshot keys, bold row, month boundaries) rolls over at midnight Beijing time (UTC+8 = 16:00 UTC). npm's per-day counts are UTC-day buckets and can't be re-bucketed, so the "today" row may show 0 until the UTC day starts.
- npm's own processing delay is outside our control — we mirror whatever the API returns and correct it on the next run after npm backfills.
- GitHub scheduled runs can be delayed a few minutes under load; since every run refreshes the full month-to-date range, nothing is lost.
- Scheduled workflows are auto-disabled after 60 days of repository inactivity — the data commits keep the repo active.
