# AGENTS.md — VOA NEWSROOM · 500 WORDS ESL STUDIO

> Handoff for the next maintainer or agent. Rebuild detail is in
> [docs/REPRODUCTION.md](docs/REPRODUCTION.md); the technical map is
> [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## 1. What this is

A static, browser-native **ESL vocabulary studio**: 500 curated VOA-style words
(125 each in World Politics, Business & Economy, Science & Tech, Culture), six
learning desks, a timestamp-based spaced-repetition system, local progress files and
a live VOA Learning English headline ticker. It is three files — `index.html`,
`style.css`, `script.js` — with no build step, no framework, no backend and no
database.

It is **not** an official VOA product, not a course or account-based LMS, not a
real-time news site, and not a native app. Live copy:
<https://somphol.github.io/voa-newsroom-esl-studio/>.
Local master: `~/Projects/voa-newsroom-esl-studio`. App version `1.0.0`
(`APP_VERSION`), with no git tag or release section yet.

**Network dependencies are real:** the page loads Google Fonts from
`fonts.googleapis.com` / `fonts.gstatic.com`, the ticker fetches VOA headlines through
the third-party `rss2json` proxy, and the read-aloud refresh optionally calls the Free
Dictionary API, Wiktionary and Wikipedia. The core studio, SRS and saved progress work
offline; fonts fall back to system faces and the ticker falls back to embedded
headlines.

## 2. Commands

```bash
cd ~/Projects/voa-newsroom-esl-studio

# run (no install, no build)
python3 -m http.server 8000          # http://localhost:8000/
open index.html                      # core works; feed/fonts need network

# live checks
curl -s -o /dev/null -w '%{http_code}\n' https://somphol.github.io/voa-newsroom-esl-studio/
curl -s -m 20 "https://api.rss2json.com/v1/api.json?rss_url=https://learningenglish.voanews.com/api/" \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("status"), len(d.get("items", [])))'

# headless smoke test (Chromium; offline mode shown)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu \
  --host-resolver-rules="MAP * ~NOTFOUND, EXCLUDE localhost" \
  --virtual-time-budget=5000 --dump-dom "http://localhost:8000/" > /tmp/voa-dom.html

# deploy — Pages serves main / root; no workflow
git push origin main
```

There is no test runner, package manager or CI workflow. Evidence is in
[docs/TESTING.md](docs/TESTING.md).

## 3. Architecture

| File | Lines | Role |
| --- | --- | --- |
| `index.html` | 459 | newsroom shell, HUD, ticker, rail, word grid, studio modal, six panels |
| `style.css` | 2,641 | navy/slate glass system, editorial type, responsive layout, reduced motion |
| `script.js` | 3,363 | 500-word data, SRS, activities, RSS, speech, storage, import/export |
| `state.json` | 124 | **build metadata only**, not runtime state |
| `STATE.md` | 72 | historical build/verification/token snapshot |

Key paths:

- **Data** — `RAW_WORDS` (`script.js:9–510`) holds 500 `[word, beat, IPA, syllables,
  definition]` tuples. `WORDS` (`602–629`) derives `id` 1–500, category metadata,
  headline, four examples and a lowercase search string.
- **State** — `makeState()` (`654`) creates the progress model and validates saved
  input. `readSavedState()`/`saveState()` (`731`, `742`) wrap `localStorage` in
  `try/catch`.
- **SRS** — `intervalDays()` (`1052`) returns 1/3/7/30 days by review count;
  `isDue()` (`1046`) compares `nextReviewDue` with `Date.now()`; `completeWord()`
  (`1143`) advances a review, updates stats/streak and saves.
- **Grid and rail** — `getFilteredWords()` (`1335`), `renderGrid()` (`1407`) and
  `renderHUD()` (`1192`) drive views, beats, search, sort, pagination (36 per page),
  due counts and ranks.
- **Studio** — `selectWord()` (`1496`), `renderStudio()` (`1464`), `setActivity()`
  (`1571`); the modal traps focus (`1553`), closes on backdrop/Escape and returns focus
  to the card.
- **Live feed** — `loadFeed()` (`1698`) fetches rss2json with a 10 s timeout, caches
  15 minutes in `sessionStorage`, sanitizes VOA URLs and matches words in titles/
  descriptions.
- **Web examples** — `fetchWebExamples()` (`1920`) queries three public APIs in
  parallel; `refreshReadExample()` (`1974`) cycles candidates; `fetchMoreExamples()`
  (`2034`) appends Wikipedia search batches.
- **Activities** — read (`2115`), listen (`2404`), editor (`2489`), match (`2564`),
  syllables (`2773`), sentence (`2896`).
- **Progress files** — `saveProgressFile()` (`3027`) downloads JSON as
  `voa_learning_progress.txt`; `importProgressFile()` (`3052`) validates and restores
  it; events are wired in `wireEvents()` (`3176`).

## 4. Decisions and constraints

- **Three static files, no build.** Do not introduce a bundler, framework, server or
  database; copy-deployability is the product.
- **Google Fonts is a deliberate-but-external dependency.** `index.html:10–12` loads
  Inter and Source Serif 4. Offline, the CSS falls back to system fonts. If strict
  offline is required, remove those three links and accept the fallback stack.
- **The live feed uses rss2json.** VOA's RSS is not CORS-readable directly from the
  browser, so the app asks a public third-party proxy. No API key is used. A blocked
  proxy must leave archive mode usable.
- **Optional example APIs are best-effort.** Free Dictionary, Wiktionary and
  Wikipedia may rate-limit or fail; built-in examples are the guaranteed path.
- **Speech is browser-native.** `SpeechSynthesis` and `SpeechRecognition`; no audio is
  recorded or uploaded. Firefox has no speech recognition, so a manual fallback exists.
- **Progress lives in `localStorage`** under `voa-newsroom.progress.v1`. Export/import is
  the portable path; never assume a server copy.
- **Per-sentence solved ticks are UI-session state** (`ui.sentenceSolvedKeys`), not part
  of the saved word record. SRS reviews still persist.
- **SRS uses ISO timestamps**, not counters of elapsed days. Do not replace them with
  “days since” arithmetic without a migration.
- **Pages is branch-hosted.** `main` / root with `.nojekyll`; there is no Actions
  workflow and no `_site` artifact.

## 5. Known issues

- **The README overstates offline self-containment.** It says no fonts are fetched and
  the privacy section lists only feed/lookup requests, but `index.html:10–12` loads
  Google Fonts on every page load. Core features work without them; the document is
  not fully self-contained.
- **Per-sentence solved ticks are not persisted.** `ui.sentenceSolvedKeys` and
  `ui.sentenceSrsKeys` live in memory only; a reload loses the ticks (the word-level SRS
  record remains). Progress files do not contain them.
- **`Reset all progress` does not clear the sentence UI sets or web-example cache.**
  `resetAllProgress()` (`3100`) resets `state` and closes the studio but leaves
  `ui.sentenceSolvedKeys`, `ui.sentenceSrsKeys` and `ui.webExamples` from the session.
  Reopening a previously solved sentence can show it as already filed.
- **Stale build metadata and copy.** `STATE.md` / `state.json` report `index.html` as
  447 lines / 25,733 bytes; the file is 459 lines / 26,684 bytes. `script.js:3` and
  `updateViewLabels()` (`1257`) say “five activities” although six desks exist.
- **Live ticker depends on rss2json.** It is a third-party service with no SLA. If it is
  down, blocked or rate-limited, the UI stays in archive mode; this is handled, not a
  crash.
- **Optional example lookups can fail.** Dictionary/Wiktionary/Wikipedia requests may
  be CORS-blocked, throttled or offline; the UI reports it and keeps built-in examples.
- **Speech coverage is browser-specific.** Recognition is Chrome/Edge only; TTS voice
  availability differs by OS. Microphone permission and actual audio were not verified
  in this documentation pass.
- **No automated tests or CI.** `STATE.md` records a historical manual/headless pass;
  the current evidence table is in `docs/TESTING.md`.
- **`state.json` and `STATE.md` are published** because the site is branch-root hosted.
  They contain build/session/token metadata (no credentials or secrets), but they are
  not needed by the app.
- **No git tag.** `APP_VERSION` is `1.0.0`, but there is no `v1.0.0` tag or release
  section; treat the commit history as the source of truth.
- **Import toast grammar.** A one-word import reports “Loaded progress for 1 words…”.
  The import succeeds; only the pluralisation is wrong.

## 6. Continuity

- Live: <https://somphol.github.io/voa-newsroom-esl-studio/> (HTTP 200 at the time of
  writing).
- Pages: `main` branch, repository root, `.nojekyll` present, no Actions workflow.
- Repository: <https://github.com/somphol/voa-newsroom-esl-studio>.
- Local master copy: `~/Projects/voa-newsroom-esl-studio`.
- First build: commit `620ac1b` “Build VOA Newsroom: 500 Words ESL Studio”.
- Latest feature work: `cf8be85` (per-sentence tracking); docs: `25d7d83`.
- Documentation release: the commit adding this file and `docs/`.
- Author: Somphol Boonjing.
- License: MIT (see `LICENSE`).
