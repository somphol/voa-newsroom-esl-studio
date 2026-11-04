# Reproduction book

How to rebuild **VOA Newsroom: 500 Words ESL Studio** from scratch if the source is
lost, or re-verify that a rebuild matches the release. Read
[ARCHITECTURE.md](ARCHITECTURE.md) first for the map.

> **The source is the truth.** `index.html`, `style.css` and `script.js` at HEAD are the
> application. `state.json` / `STATE.md` are historical build metadata, not runtime
> state. Rebuild only when the source is unavailable or you deliberately want a variant.

## 1. What is being reproduced

A three-file, browser-native ESL vocabulary studio:

- **Word library** — 500 unique words, exactly 125 per beat, each with IPA, syllable
  chunks, definition, headline and four example sentences.
- **Assignment desk** — all/due/practicing/mastered views, beat filters, search, five
  sort modes, 36 cards per page and Load More.
- **Reporter HUD** — Intern → Field Journalist → Senior Editor → Anchor, mastery out of
  500, daily streak, accuracy, attempts.
- **Live ticker** — VOA Learning English headlines through rss2json, 15-minute
  `sessionStorage` cache, word matching, highlighting, safe links and archive fallback.
- **Six desks** — read-aloud with speech recognition or manual fallback, listening with
  TTS at 0.5×/0.8×/1.0×, copy-editor blank, 60-second match, syllable/stress explorer,
  sentence fill-in-the-blank with per-sentence reset.
- **SRS** — ISO timestamp math, intervals 1/3/7/30 days, due queue, review counts,
  streak and accuracy.
- **Comfort and portability** — 80–140% text size, dark/light theme, automatic
  `localStorage`, JSON progress download/upload as `voa_learning_progress.txt`.
- **Delivery** — static files, no build, GitHub Pages `main` / root, `.nojekyll`.
- **Version** — `APP_VERSION = "1.0.0"`; no git tag yet.

## 2. Requirements matrix

| # | Requirement | Implementation | Where |
| --- | --- | --- | --- |
| 1 | 500 curated words, 125 per beat | `RAW_WORDS` + `CATEGORY_META` | `script.js:9–629` |
| 2 | Six learning desks | activity tabs/panels + renderers | `index.html:275–432`, `script.js:2094–3021` |
| 3 | SRS intervals and due queue | `intervalDays`, `isDue`, `completeWord` | `script.js:1042–1186` |
| 4 | Live VOA headlines with fallback | `loadFeed`, `applyFeed`, `renderTicker` | `script.js:1603–1787` |
| 5 | Fresh read-aloud examples | dictionary/Wiktionary/Wikipedia fetchers | `script.js:1805–2092` |
| 6 | Native speech in and out | `SpeechRecognition`, `SpeechSynthesis` | `script.js:631–635`, `2154–2370` |
| 7 | Progress survives reloads | `makeState`, `readSavedState`, `saveState` | `script.js:641–748` |
| 8 | Portable progress files | `saveProgressFile`, `importProgressFile` | `script.js:3027–3098` |
| 9 | Text scaling and themes, persisted | `applyFontScale`, `applyTheme`, settings | `script.js:3130–3170` |
| 10 | Search, beats, sorting, pagination | `getFilteredWords`, `renderGrid`, `PAGE_SIZE` | `script.js:1335–1436` |
| 11 | Accessible word-studio modal | `role="dialog"`, focus trap, Escape/backdrop close | `index.html:236`, `script.js:1553–1569` |
| 12 | Responsive newsroom layout | CSS breakpoints 1380/1180/900/820/640 px | `style.css:2392–2641` |
| 13 | Static branch-hosted delivery | three files + `.nojekyll` | repo root |
| 14 | No build or backend | plain HTML/CSS/JS | whole repo |

## 3. Build order

1. **Shell** — `index.html` head, skip link, top bar, HUD, ticker, rail/content/studio
   landmarks, footer.
2. **Design system** — `style.css` tokens, background, glass surfaces, type scale,
   responsive breakpoints.
3. **Word data** — the 500 tuples, beat metadata, derived `WORDS`, ids and examples.
4. **State** — `makeState`, default word records, storage read/write, validation.
5. **SRS and HUD** — intervals, due logic, ranks, counts, streak/accuracy.
6. **Grid** — cards, filters, search, sort, pagination.
7. **Studio shell** — modal, dossier, SRS strip, six tabs/panels, focus management.
8. **Desks** — read, listen, editor, match, syllables, sentence; each wired to
   `completeWord`/`recordMiss`.
9. **Live feed** — rss2json fetch, cache, matching, sanitizing, ticker and fallback.
10. **Web examples** — three lookup APIs, filtering, refresh, More examples paging.
11. **Progress files** — export payload, download, import validation and re-render.
12. **Comfort** — theme, font scale, toast.
13. **Events/boot** — delegated handlers, keyboard, storage sync, `init()`.
14. **Docs and metadata** — README, CHANGELOG, robots, sitemap, screenshots, social card.

## 4. Acceptance checks

A rebuild is done when all of these pass:

1. `RAW_WORDS` has **500 unique words**, exactly **125** in each of WP/BE/ST/CU, and no
   empty IPA, syllable, or definition field.
2. Opening the app renders **36 cards** (`Showing 36 of 500 words`) and Load More
   increases the page.
3. All/due/practicing/mastered views, beat tabs, search and five sort modes filter the
   grid without errors.
4. Clicking a card opens the studio with **six** tabs and panels; Tab is trapped,
   Escape/backdrop closes it, and focus returns to the card.
5. A correct editor or sentence answer increments the word's review count; the first
   review shows `L1 · 1d`, the second `L2 · 3d`.
6. A miss keeps the word due and increments attempts; a mastered word needs six correct
   reviews and then shows `L4 · 30d`.
7. Theme, font scale, word records, streak and stats survive a reload.
8. A saved `voa_learning_progress.txt` restores word records, theme, font scale, streak
   and stats; invalid files show a readable toast and change nothing.
9. With the network blocked, the app still renders 36 cards, shows archive mode and uses
   system fonts; built-in examples remain usable.
10. With the network available, the ticker shows real VOA Learning English headlines and
    links only to `learningenglish.voanews.com`.
11. Speech desks detect browser support and offer fallbacks when recognition or TTS is
    missing.
12. At 390 px and 1024 px the HUD stacks, the grid reflows, and the studio becomes a
    usable near-full-screen modal.
13. `main` / root serves the three files with `.nojekyll`; no build or workflow is
    required.

Record what you ran in [TESTING.md](TESTING.md) rather than assuming.

## 5. Provenance

| Item | Value |
| --- | --- |
| Initial build | `620ac1b` “Build VOA Newsroom: 500 Words ESL Studio” |
| Build state + token usage | `1f74b34` |
| Accessible studio modal | `ad5dbb4` |
| Text scaling, sentence bank, sentence practice | `71767e7` |
| Web example refresh | `692d469` |
| On-demand example paging | `24d6fce` |
| Per-sentence tracking + reset | `cf8be85` |
| Social card + README header | `ae6788c` |
| Repository docs/community files | `25d7d83` |
| Release docs | this commit (`AGENTS.md` + `docs/`) |
| App version | `1.0.0` (`APP_VERSION`; no tag) |
| Author | Somphol Boonjing |
| License | MIT (see `LICENSE`) |

Do not invent a release history: `CHANGELOG.md` is the record. `STATE.md` and
`state.json` are snapshots from the original build, not a second changelog.
