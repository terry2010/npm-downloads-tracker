# NPM Downloads Tracker

Daily download counts for watched npm packages, fetched every morning (00:00 UTC / 08:00 Beijing time) by GitHub Actions.

_Last updated: 2026-11-14 08:56 UTC_

## Watched packages

- `dsh-loop-recover`
- `dsh-rss-news-daily`
- `opencode-loop-recover`
- `oc-market-quail-zephyr-72a0`
- `awesome-opencode-market`
- `surfbird`
- `surfbird-mcp`

## 2026-11 — month to date

| Package | Total | Est. real | Avg/day | Peak | Today | Trend |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `dsh-loop-recover` | 955 | 655 | 68.2 | 329 · 11-05 | 0 | ▂▂▁▃█▃▂▂▁▂▂▂▁▁ |
| `dsh-rss-news-daily` | 2,426 | 926 | 173.3 | 403 · 11-09 | 0 | ▂▅█▅█▂▂▅█▂▂▆▁▁ |
| `opencode-loop-recover` | 637 | 487 | 45.5 | 228 · 11-03 | 0 | ▄▃█▃▁▁▂▁▁▁▁▂▁▁ |
| `oc-market-quail-zephyr-72a0` | 1,421 | 264 | 101.5 | 505 · 11-12 | 0 | ▁▇▁▆▁▁▁▁▁▁▁█▁▁ |
| `awesome-opencode-market` | 521 | 91 | 37.2 | 280 · 11-04 | 0 | ▁▁▁█▁▁▁▁▁▁▁▅▁▁ |
| `surfbird` | — | — | — | — | — | — |
| `surfbird-mcp` | — | — | — | — | — | — |

> Fetch errors: `surfbird`: HTTP 404 · `surfbird-mcp`: HTTP 404

> `Est. real` subtracts ~150 automated downloads per version published that day — every `npm publish` triggers a scanner/mirror fetch wave. It's an upper bound on organic installs (ambient crawlers and CI can't be separated).

```mermaid
%%{init: {'xyChart': {'width': 960, 'height': 320}}}%%
xychart-beta
    title "Daily downloads - 2026-11"
    x-axis ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"]
    y-axis "downloads" 0 --> 1000
    line "dsh-loop-recover" [43, 46, 39, 99, 329, 88, 66, 56, 27, 42, 54, 66, 0, 0]
    line "dsh-rss-news-daily" [58, 209, 359, 237, 361, 70, 61, 224, 403, 70, 91, 283, 0, 0]
    line "opencode-loop-recover" [105, 74, 228, 63, 19, 16, 52, 6, 10, 11, 10, 43, 0, 0]
    line "oc-market-quail-zephyr-72a0" [0, 407, 22, 354, 39, 14, 15, 7, 40, 10, 8, 505, 0, 0]
    line "awesome-opencode-market" [0, 0, 0, 280, 17, 9, 17, 22, 4, 1, 7, 164, 0, 0]
```

### Daily — 2026-11

| Date | `dsh-loop-recover` | `dsh-rss-news-daily` | `opencode-loop-recover` | `oc-market-quail-zephyr-72a0` | `awesome-opencode-market` | `surfbird` | `surfbird-mcp` | Total | Est. real |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 2026-11-01 | 43 | 58 | 105 | 0 | 0 | — | — | 206 | 206 |
| 2026-11-02 | 46 | 209 | 74 | 407 | 0 | — | — | 736 | 179 |
| 2026-11-03 | 39 | 359 | 228 | 22 | 0 | — | — | 648 | 198 |
| 2026-11-04 | 99 | 237 | 63 | 354 | 280 | — | — | 1,033 | 303 |
| 2026-11-05 | 329 | 361 | 19 | 39 | 17 | — | — | 765 | 165 |
| 2026-11-06 | 88 | 70 | 16 | 14 | 9 | — | — | 197 | 197 |
| 2026-11-07 | 66 | 61 | 52 | 15 | 17 | — | — | 211 | 211 |
| 2026-11-08 | 56 | 224 | 6 | 7 | 22 | — | — | 315 | 165 |
| 2026-11-09 | 27 | 403 | 10 | 40 | 4 | — | — | 484 | 184 |
| 2026-11-10 | 42 | 70 | 11 | 10 | 1 | — | — | 134 | 134 |
| 2026-11-11 | 54 | 91 | 10 | 8 | 7 | — | — | 170 | 170 |
| 2026-11-12 | 66 | 283 | 43 | 505 | 164 | — | — | 1,061 | 311 |
| 2026-11-13 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| **2026-11-14** | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |

## Docker Hub pulls

| Image | All-time pulls | 2026-11 est. | Today | Trend |
| --- | ---: | ---: | ---: | ---: |
| `terry2010/surfbird` | 426 | — | — | ▁▁▁▁▁▁▁▁▁▁▁▁▁▁ |

> Docker Hub only exposes a cumulative `pull_count` — daily figures are diffs between once-a-day snapshots, so they lag ~1 day. `≈` marks days inside a missed-run gap (delta spread evenly). Same bot-wave caveat as npm: new tags get pulled by image scanners.

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
| 2026-11-13 | — | — |
| **2026-11-14** | — | — |

## Monthly history

| Month | `dsh-loop-recover` | `dsh-rss-news-daily` | `opencode-loop-recover` | `oc-market-quail-zephyr-72a0` | `awesome-opencode-market` | `surfbird` | `surfbird-mcp` | Grand total | Est. real |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 2026-10 | 1,453 | 2,214 | 767 | 0 | 0 | — | — | 4,434 | 487 |
| 2026-11 (MTD) | 955 | 2,426 | 637 | 1,421 | 521 | — | — | 5,960 | 2,423 |

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
```

| Date | `dsh-loop-recover` | `dsh-rss-news-daily` | `opencode-loop-recover` | `oc-market-quail-zephyr-72a0` | `awesome-opencode-market` | `surfbird` | `surfbird-mcp` | Total | Est. real |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 2026-10-01 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-02 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-03 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-04 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-05 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-06 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-07 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-08 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-09 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-10 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-11 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-12 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-13 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-14 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-15 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-16 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-17 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-18 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-19 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-20 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-21 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-22 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-23 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-24 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-25 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-26 | 0 | 0 | 0 | 0 | 0 | — | — | 0 | 0 |
| 2026-10-27 | 422 | 834 | 0 | 0 | 0 | — | — | 1,256 | 0 |
| 2026-10-28 | 291 | 397 | 0 | 0 | 0 | — | — | 688 | 97 |
| 2026-10-29 | 326 | 214 | 0 | 0 | 0 | — | — | 540 | 90 |
| 2026-10-30 | 346 | 525 | 0 | 0 | 0 | — | — | 871 | 121 |
| 2026-10-31 | 68 | 244 | 767 | 0 | 0 | — | — | 1,079 | 179 |

</details>

---

_Generated by `scripts/update.mjs` — raw data in `data/`_
