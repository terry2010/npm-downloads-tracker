# NPM Downloads Tracker

Daily download counts for watched npm packages, fetched daily at 16:10 UTC (00:10 Beijing time) by GitHub Actions.
Days roll over at midnight Beijing time (UTC+8); npm per-day counts are UTC-day buckets, so the "today" row may stay 0 until the UTC day starts.

_Last updated: 2026-11-18 06:10 UTC_

## Watched packages

- `dsh-loop-recover`
- `dsh-rss-news-daily`
- `dsh-rss-news-flash-kuaixun`
- `dsh-rss-news-browser-fetch`
- `opencode-loop-recover`
- `oc-market-quail-zephyr-72a0`
- `awesome-opencode-market`
- `surfbird`
- `surfbird-mcp`
- `dsh-control-surfbird-for-kitesurf`
- `opencode-control-surfbird-for-kitesurf`
- `pi-control-surfbird-for-kitesurf`

## 2026-11 — month to date

| Package | Total | Est. real | Avg/day | Peak | Today | Trend |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `dsh-loop-recover` | 1,348 | 898 | 74.9 | 329 · 11-05 | 0 | ▂▂▁▃█▃▂▂▁▂▂▂▆▂▂▂▁▁ |
| `dsh-rss-news-daily` | 3,251 | 1,301 | 180.6 | 403 · 11-09 | 0 | ▂▅█▅█▂▂▅█▂▂▆▆▆▂▅▁▁ |
| `dsh-rss-news-flash-kuaixun` | — | — | — | — | — | — |
| `dsh-rss-news-browser-fetch` | — | — | — | — | — | — |
| `opencode-loop-recover` | 1,012 | 712 | 56.2 | 228 · 11-03 | 0 | ▄▃█▃▁▁▂▁▁▁▁▂▂▂▇▄▁▁ |
| `oc-market-quail-zephyr-72a0` | 1,493 | 336 | 82.9 | 505 · 11-12 | 0 | ▁▇▁▆▁▁▁▁▁▁▁█▁▁▁▁▁▁ |
| `awesome-opencode-market` | 577 | 147 | 32.1 | 280 · 11-04 | 0 | ▁▁▁█▁▁▁▁▁▁▁▅▁▁▁▁▁▁ |
| `surfbird` | 714 | 147 | 39.7 | 412 · 11-14 | 0 | ▁▁▁▁▁▁▁▁▁▁▁▁▆█▁▁▁▁ |
| `surfbird-mcp` | 735 | 159 | 40.8 | 408 · 11-14 | 0 | ▁▁▁▁▁▁▁▁▁▁▁▁▆█▁▁▁▁ |
| `dsh-control-surfbird-for-kitesurf` | 1,248 | 198 | 69.3 | 1,209 · 11-15 | 0 | ▁▁▁▁▁▁▁▁▁▁▁▁▁▁█▁▁▁ |
| `opencode-control-surfbird-for-kitesurf` | 697 | 97 | 38.7 | 387 · 11-16 | 0 | ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▇█▁▁ |
| `pi-control-surfbird-for-kitesurf` | 238 | 0 | 13.2 | 238 · 11-16 | 0 | ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█▁▁ |

> Fetch errors: `dsh-rss-news-flash-kuaixun`: HTTP 404 · `dsh-rss-news-browser-fetch`: HTTP 404

> `Est. real` subtracts ~150 automated downloads per version published that day — every `npm publish` triggers a scanner/mirror fetch wave. It's an upper bound on organic installs (ambient crawlers and CI can't be separated).

```mermaid
%%{init: {'xyChart': {'width': 960, 'height': 320}}}%%
xychart-beta
    title "Daily downloads - 2026-11"
    x-axis ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"]
    y-axis "downloads" 0 --> 2000
    line "dsh-loop-recover" [43, 46, 39, 99, 329, 88, 66, 56, 27, 42, 54, 66, 214, 67, 53, 59, 0, 0]
    line "dsh-rss-news-daily" [58, 209, 359, 237, 361, 70, 61, 224, 403, 70, 91, 283, 258, 271, 84, 212, 0, 0]
    line "opencode-loop-recover" [105, 74, 228, 63, 19, 16, 52, 6, 10, 11, 10, 43, 41, 47, 187, 100, 0, 0]
    line "oc-market-quail-zephyr-72a0" [0, 407, 22, 354, 39, 14, 15, 7, 40, 10, 8, 505, 43, 12, 11, 6, 0, 0]
    line "awesome-opencode-market" [0, 0, 0, 280, 17, 9, 17, 22, 4, 1, 7, 164, 21, 10, 15, 10, 0, 0]
    line "surfbird" [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 267, 412, 16, 19, 0, 0]
    line "surfbird-mcp" [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 276, 408, 28, 23, 0, 0]
    line "dsh-control-surfbird-for-kitesurf" [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1209, 39, 0, 0]
    line "opencode-control-surfbird-for-kitesurf" [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 310, 387, 0, 0]
    line "pi-control-surfbird-for-kitesurf" [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 238, 0, 0]
```

### Daily — 2026-11

| Date | `dsh-loop-recover` | `dsh-rss-news-daily` | `dsh-rss-news-flash-kuaixun` | `dsh-rss-news-browser-fetch` | `opencode-loop-recover` | `oc-market-quail-zephyr-72a0` | `awesome-opencode-market` | `surfbird` | `surfbird-mcp` | `dsh-control-surfbird-for-kitesurf` | `opencode-control-surfbird-for-kitesurf` | `pi-control-surfbird-for-kitesurf` | Total | Est. real |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 2026-11-01 | 43 | 58 | — | — | 105 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 206 | 206 |
| 2026-11-02 | 46 | 209 | — | — | 74 | 407 | 0 | 0 | 0 | 0 | 0 | 0 | 736 | 179 |
| 2026-11-03 | 39 | 359 | — | — | 228 | 22 | 0 | 0 | 0 | 0 | 0 | 0 | 648 | 198 |
| 2026-11-04 | 99 | 237 | — | — | 63 | 354 | 280 | 0 | 0 | 0 | 0 | 0 | 1,033 | 303 |
| 2026-11-05 | 329 | 361 | — | — | 19 | 39 | 17 | 0 | 0 | 0 | 0 | 0 | 765 | 165 |
| 2026-11-06 | 88 | 70 | — | — | 16 | 14 | 9 | 0 | 0 | 0 | 0 | 0 | 197 | 197 |
| 2026-11-07 | 66 | 61 | — | — | 52 | 15 | 17 | 0 | 0 | 0 | 0 | 0 | 211 | 211 |
| 2026-11-08 | 56 | 224 | — | — | 6 | 7 | 22 | 0 | 0 | 0 | 0 | 0 | 315 | 165 |
| 2026-11-09 | 27 | 403 | — | — | 10 | 40 | 4 | 0 | 0 | 0 | 0 | 0 | 484 | 184 |
| 2026-11-10 | 42 | 70 | — | — | 11 | 10 | 1 | 0 | 0 | 0 | 0 | 0 | 134 | 134 |
| 2026-11-11 | 54 | 91 | — | — | 10 | 8 | 7 | 0 | 0 | 0 | 0 | 0 | 170 | 170 |
| 2026-11-12 | 66 | 283 | — | — | 43 | 505 | 164 | 0 | 0 | 0 | 0 | 0 | 1,061 | 311 |
| 2026-11-13 | 214 | 258 | — | — | 41 | 43 | 21 | 267 | 276 | 0 | 0 | 0 | 1,120 | 277 |
| 2026-11-14 | 67 | 271 | — | — | 47 | 12 | 10 | 412 | 408 | 0 | 0 | 0 | 1,227 | 477 |
| 2026-11-15 | 53 | 84 | — | — | 187 | 11 | 15 | 16 | 28 | 1,209 | 310 | 0 | 1,913 | 413 |
| 2026-11-16 | 59 | 212 | — | — | 100 | 6 | 10 | 19 | 23 | 39 | 387 | 238 | 1,093 | 405 |
| 2026-11-17 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **2026-11-18** | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Docker Hub pulls

| Image | All-time pulls | 2026-11 est. | Today | Trend |
| --- | ---: | ---: | ---: | ---: |
| `terry2010/surfbird` | 691 | 691 | 4 | ▁▁▁▁▁▁▁▁▁▁▁▁██▂▁▁▁ |

> Docker Hub only exposes a cumulative `pull_count` — daily figures are diffs between once-a-day snapshots, so they lag ~1 day. `≈` marks days inside a missed-run gap or a new repo’s pre-tracking baseline (delta spread evenly). Same bot-wave caveat as npm: new tags get pulled by image scanners.

### Daily pulls — 2026-11

| Date | `terry2010/surfbird` | Total |
| --- | ---: | ---: |
| 2026-11-01 | — | — |
| 2026-11-02 | — | — |
| 2026-11-03 | — | — |
| 2026-11-04 | — | — |
| 2026-11-05 | — | — |
| 2026-11-06 | — | — |
| 2026-11-07 | — | — |
| 2026-11-08 | — | — |
| 2026-11-09 | — | — |
| 2026-11-10 | — | — |
| 2026-11-11 | — | — |
| 2026-11-12 | — | — |
| 2026-11-13 | ≈290 | 290 |
| 2026-11-14 | ≈289 | 289 |
| 2026-11-15 | 67 | 67 |
| 2026-11-16 | 29 | 29 |
| 2026-11-17 | 12 | 12 |
| **2026-11-18** | 4 | 4 |

## Monthly history

| Month | `dsh-loop-recover` | `dsh-rss-news-daily` | `dsh-rss-news-flash-kuaixun` | `dsh-rss-news-browser-fetch` | `opencode-loop-recover` | `oc-market-quail-zephyr-72a0` | `awesome-opencode-market` | `surfbird` | `surfbird-mcp` | `dsh-control-surfbird-for-kitesurf` | `opencode-control-surfbird-for-kitesurf` | `pi-control-surfbird-for-kitesurf` | Grand total | Est. real |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 2026-10 | 1,453 | 2,214 | — | — | 767 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 4,434 | 487 |
| 2026-11 (MTD) | 1,348 | 3,251 | — | — | 1,012 | 1,493 | 577 | 714 | 735 | 1,248 | 697 | 238 | 11,313 | 3,995 |

<details>
<summary>Daily downloads — 2026-10</summary>

```mermaid
%%{init: {'xyChart': {'width': 960, 'height': 320}}}%%
xychart-beta
    title "Daily downloads - 2026-10"
    x-axis ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]
    y-axis "downloads" 0 --> 1000
    line "dsh-loop-recover" [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 422, 291, 326, 346, 68]
    line "dsh-rss-news-daily" [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 834, 397, 214, 525, 244]
    line "opencode-loop-recover" [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 767]
    line "oc-market-quail-zephyr-72a0" [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    line "awesome-opencode-market" [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    line "surfbird" [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    line "surfbird-mcp" [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    line "dsh-control-surfbird-for-kitesurf" [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    line "opencode-control-surfbird-for-kitesurf" [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    line "pi-control-surfbird-for-kitesurf" [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

| Date | `dsh-loop-recover` | `dsh-rss-news-daily` | `dsh-rss-news-flash-kuaixun` | `dsh-rss-news-browser-fetch` | `opencode-loop-recover` | `oc-market-quail-zephyr-72a0` | `awesome-opencode-market` | `surfbird` | `surfbird-mcp` | `dsh-control-surfbird-for-kitesurf` | `opencode-control-surfbird-for-kitesurf` | `pi-control-surfbird-for-kitesurf` | Total | Est. real |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 2026-10-01 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-02 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-03 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-04 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-05 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-06 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-07 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-08 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-09 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-10 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-11 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-12 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-13 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-14 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-15 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-16 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-17 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-18 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-19 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-20 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-21 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-22 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-23 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-24 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-25 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-26 | 0 | 0 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2026-10-27 | 422 | 834 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1,256 | 0 |
| 2026-10-28 | 291 | 397 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 688 | 97 |
| 2026-10-29 | 326 | 214 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 540 | 90 |
| 2026-10-30 | 346 | 525 | — | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 871 | 121 |
| 2026-10-31 | 68 | 244 | — | — | 767 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1,079 | 179 |

</details>

---

_Generated by `scripts/update.mjs` — raw data in `data/`_
