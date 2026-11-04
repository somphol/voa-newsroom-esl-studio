# Testing

## Status of this release

| Evidence | When | Result |
| --- | --- | --- |
| Word-data audit (Node) | 2026-11-03 | **500 unique, 125 per beat, 0 bad fields** |
| Live Pages probe (`curl`) | 2026-11-03 | **200** |
| Live root vs local `index.html` (SHA-1) | 2026-11-03 | **match** (`c06ad921…`) |
| Google Fonts stylesheet probe | 2026-11-03 | **200** (external dependency confirmed) |
| VOA feed via rss2json | 2026-11-03 | **status ok, 10 items, real `learningenglish.voanews.com` links** |
| Headless offline render (1440 × 1000) | 2026-11-03 | **36 cards, archive mode**, DOM 51,227 bytes; PNG 577,273 bytes |
| Headless live render (1440 × 1000) | 2026-11-03 | **live ticker**, DOM 55,638 bytes; PNG 589,855 bytes |
| Interactive UI harness | 2026-11-03 | **6 tabs/panels, editor → L1, sentence → L2** |
| Reload persistence | 2026-11-03 | **light theme, 110% text, due 499, word Practicing** |
| Progress import | 2026-11-03 | **1 mastered word, light theme, 120% text** |
| Export download file | — | **Toast verified; file capture not verified** |
| Microphone / TTS audio | — | **Not verified** |
| Safari / Firefox / mobile / screen reader | — | **Not verified** |
| CI | — | **None exists** in this repository |

The documentation commit changed Markdown only; the three application files are
untouched. “Live” results were obtained with network access; offline results blocked
all hosts except localhost. Neither is a substitute for a real learner session.

## 1. Commands

```bash
cd ~/Projects/voa-newsroom-esl-studio

# run
python3 -m http.server 8000          # http://localhost:8000/
open index.html                      # core works from file://

# live checks
curl -s -o /dev/null -w '%{http_code}\n' https://somphol.github.io/voa-newsroom-esl-studio/
curl -s -m 20 "https://api.rss2json.com/v1/api.json?rss_url=https://learningenglish.voanews.com/api/" \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("status"), len(d.get("items", [])))'
curl -s -o /dev/null -w '%{http_code}\n' "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&display=swap"

# headless offline smoke test (36 cards, archive mode)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu \
  --host-resolver-rules="MAP * ~NOTFOUND, EXCLUDE localhost" \
  --virtual-time-budget=5000 --dump-dom "http://localhost:8000/" > /tmp/voa-dom.html

# headless screenshot
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu \
  --host-resolver-rules="MAP * ~NOTFOUND, EXCLUDE localhost" \
  --virtual-time-budget=5000 --window-size=1440,1000 \
  --screenshot=/tmp/voa.png "http://localhost:8000/"
```

## 2. Static results (2026-11-03)

- Live site: HTTP `200`; `last-modified` Sun, 01 Nov 2026 16:39:58 GMT;
  `cache-control: max-age=600`; ETag `"6ae76b5e-683c"`.
- Live `index.html` SHA-1 `c06ad9214cdf016abe19076ab240e9a7a18b5c30`, identical to the
  local file.
- Word audit: **500** rows, **500** unique words, `{WP:125, BE:125, ST:125, CU:125}`,
  no missing IPA/syllable/definition fields.
- Google Fonts CSS endpoint returns `200 text/css` — the page is **not** fully
  self-contained.
- rss2json returns `status ok` with **10** items; the first title was an “Everyday
  Grammar Video: Ramen…” item and its link was on `learningenglish.voanews.com`.
- Published root includes `state.json`, `STATE.md`, `README.md`, screenshots and
  `docs/social-card.png`; `.nojekyll` is present but dotfiles return 404 over HTTP.

### Offline render

- DOM: **51,227 bytes**, **36** word cards.
- `#feedStatusText`: “Live feed offline · archive mode”.
- Ticker: “Live VOA headlines are unavailable right now. The newsroom template archive
  is still open.”
- Screenshot 1440 × 1000: **577,273 bytes**.
- With Google Fonts blocked, the page falls back to system fonts and still lays out.

### Live render

- DOM: **55,638 bytes**.
- `#feedStatusText`: “Live VOA feed”.
- Ticker contained real VOA items and `learningenglish.voanews.com` links.
- Screenshot 1440 × 1000: **589,855 bytes**.

### `file://`

- DOM rendered **36** cards and archive mode with all external hosts blocked; core
  localStorage/storage code did not throw. A local server is still recommended for
  feed/speech.

## 3. Interactive harness

A throwaway copy in `/tmp` had a small script appended; the repository was not modified.
It clicked the first card (`accent`), opened the editor desk, selected the correct
option, then opened Sentence Practice and typed the word.

Observed:

| Field | Value |
| --- | --- |
| Cards rendered | `36` |
| Studio open | `true` |
| Word / IPA | `accent` / `/ˈækˌsɛnt/` |
| Activity tabs / panels | `6` / `6` |
| Editor result | review count `1`, level `L1 · 1d` |
| Editor feedback | “Filed. ‘accent’ completes the headline. SRS timestamp updated.” |
| Sentence result | review count `2`, level `L2 · 3d` |
| Sentence status | “Sentence filed. Refresh for another example or reset this sentence.” |
| Theme after toggle | `light`, persisted as `light` |
| Font after one step | `110%`, persisted as `1.1` |

### Reload

The same browser profile was reloaded against the unmodified file:

| Field | Value |
| --- | --- |
| `data-theme` | `light` |
| Font label | `110%` |
| Due count | `499` |
| First card | `accent`, `Practicing` |

This confirms word records, theme and font scale load from
`voa-newsroom.progress.v1`.

### Progress import

A `DataTransfer`/`File` payload with one recognized word (`reviewCount: 6`), light
theme and `fontScale: 1.2` was dispatched to `#loadInput`. Result:

```text
mastered: 1
theme:    light
font:     120%
toast:    Loaded progress for 1 words from voa_learning_progress.txt.
```

Import validation and re-render work. The toast’s “1 words” grammar is a known rough
edge, not a functional failure.

### Export

Clicking **Save Progress File** produced the toast
“Progress file saved as voa_learning_progress.txt.” Headless Chrome did not write the
download to the requested directory, so **the downloaded file itself was not inspected
in this pass**. The export shape is defined in `saveProgressFile()` and was verified in
the original build snapshot (`STATE.md`).

## 4. Manual matrix

Run in a desktop browser, once live and once with the network blocked.

| # | Check | Expected |
| --- | --- | --- |
| 1 | Load | 36 cards, HUD at 0/500, Intern, ticker live or archive |
| 2 | Load More | next 36 cards; result line updates |
| 3 | Beat tabs / rail beats | 125-word filtered sets |
| 4 | Search `sanc` | sanction and matching words |
| 5 | Sort A→Z, Z→A, Due first, Least/Most reviewed | order changes as labelled |
| 6 | Due Today / Practicing / Mastered | counts match the grid |
| 7 | Click a card | studio modal opens with word, IPA, definition, SRS strip |
| 8 | Six activity tabs | each panel switches; Tab stays inside; Escape/backdrop closes |
| 9 | Editor: choose correct / wrong | correct files SRS; wrong gives hint, no level |
| 10 | Listen: 0.5/0.8/1.0×, replay, type answer | TTS plays; exact word files SRS |
| 11 | Read: microphone allowed/denied | transcript/accuracy or readable fallback |
| 12 | Match: start, pair, mismatch, timeout | 60 s, score, −2 s on mismatch |
| 13 | Syllables: tap chunk, play all, slow | each chunk speaks; stress chunk highlighted |
| 14 | Sentence: refresh, fill, solve, reset | four examples; reset allows re-practice without new SRS |
| 15 | SRS review 1→6 | 1d, 3d, 3d, 7d, 7d, 30d; Mastered at 6 |
| 16 | Theme / A− / A+ | instant, clamped 80–140%, survives reload |
| 17 | Export then import on another profile | word records, streak, stats, theme, font restored |
| 18 | Reset all progress | confirm, all records clear, studio closes |
| 19 | Block network | 36 cards, archive mode, built-in examples, system fonts |
| 20 | 1024 px and 390 px | HUD stacks, grid reflows, modal usable |

## 5. Failure triage

- **No ticker** — rss2json blocked/down, CORS, or no network. Archive mode is expected.
- **Fonts look different** — Google Fonts blocked; system fallback is intentional.
- **No speech recognition** — Firefox or unsupported browser; use the manual fallback.
- **No TTS voice** — OS/browser voice list empty; playback resolves false but does not
  crash.
- **Progress not saved** — private mode/quota; export a file and inspect the toast.
- **Import rejected** — not JSON, no `words`, or no recognized ids. `makeState()` drops
  invalid rows rather than throwing.
- **Wrong due date** — inspect ISO timestamps and `intervalDays`; do not compare local
  date strings.
- **Empty grid** — search/filter combination; Reset filters.
- **Cards show the wrong word** — `RAW_WORDS` order defines ids; changing rows changes
  every saved record.

## 6. Not verified

- Real microphone input, permission prompts and recognition accuracy.
- Actual TTS audio on any OS; only the availability checks were exercised.
- A complete 60-second match round, and the 61-entry due/history edge cases.
- The exported file’s contents/download in this pass (toast only).
- `Reset all progress` (blocking `confirm`) and its effect on session-only UI sets.
- Safari, Firefox, Edge, real iOS/Android, touch and screen-reader output.
- Live API stability/rate limits beyond one successful fetch.
- That all 500 words render and every sentence/blank is well formed; the data audit
  checked structure, not every rendered sentence.
- Whether Google Fonts is acceptable for the project’s privacy expectations; the code
  currently requests it on every load.
