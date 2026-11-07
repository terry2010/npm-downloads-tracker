# npm-downloads-tracker

Tracks daily [npm](https://www.npmjs.com/) download counts for a watchlist of packages. Data is fetched every morning by GitHub Actions and rendered as a markdown dashboard.

Dashboard: [DASHBOARD.md](DASHBOARD.md)

## Watched packages

- `dsh-loop-recover`
- `dsh-rss-news-daily`
- `opencode-loop-recover`
- `oc-market-quail-zephyr-72a0`
- `awesome-opencode-market`

To watch more packages, edit `packages.json`.

## How it works

- `.github/workflows/daily.yml` runs `scripts/update.mjs` daily at 00:00 UTC (08:00 Beijing time), plus on-demand via `workflow_dispatch`.
- For each package it calls `https://api.npmjs.org/downloads/range/<prev-month-01>:<today>/<pkg>` — one request per package covering last month and the current month, so a missed run self-heals on the next one.
- Results are stored in `data/YYYY-MM.json` (sparse `date -> downloads` maps per package) and `DASHBOARD.md` is regenerated.

## Commands

```bash
npm run update   # fetch latest data and rebuild the dashboard
```

## Notes

- Day boundaries follow npm's daily counts (UTC).
- GitHub scheduled runs can be delayed a few minutes under load; since every run refreshes the full month-to-date range, nothing is lost.
- Scheduled workflows are auto-disabled after 60 days of repository inactivity — the daily data commits keep the repo active.
