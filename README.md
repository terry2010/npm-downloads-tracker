# npm-downloads-tracker

Tracks daily [npm](https://www.npmjs.com/) download counts for a watchlist of packages. Data is fetched hourly by GitHub Actions and rendered as a markdown dashboard.

Dashboard: [DASHBOARD.md](DASHBOARD.md)

## Watched packages

- `dsh-loop-recover`
- `dsh-rss-news-daily`
- `opencode-loop-recover`
- `oc-market-quail-zephyr-72a0`
- `awesome-opencode-market`

To watch more packages, edit `packages.json`.

## How it works

- `.github/workflows/daily.yml` runs `scripts/update.mjs` hourly at minute 13 UTC, plus on-demand via `workflow_dispatch`.
- npm often leaves recent days at 0 or missing, then backfills them in batches days later. Every run re-fetches the whole previous-month + current-month-to-date range per package (`https://api.npmjs.org/downloads/range/<prev-month-01>:<today>/<pkg>`), so corrections are picked up automatically — usually within an hour of npm publishing them.
- Data files are only rewritten when numbers actually change, so the repo stays quiet while npm has nothing new. `DASHBOARD.md`'s "Last updated" reflects the last real data change.
- Results are stored in `data/YYYY-MM.json` (sparse `date -> downloads` maps per package) and `DASHBOARD.md` is regenerated.

## Commands

```bash
npm run update   # fetch latest data and rebuild the dashboard
```

## Notes

- Day boundaries follow npm's daily counts (UTC).
- npm's own processing delay is outside our control — we mirror whatever the API returns and correct it on the next run after npm backfills.
- GitHub scheduled runs can be delayed a few minutes under load; since every run refreshes the full month-to-date range, nothing is lost.
- Scheduled workflows are auto-disabled after 60 days of repository inactivity — the data commits keep the repo active.
