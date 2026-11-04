# Architecture

`voa-newsroom-esl-studio` is three static files: `index.html`, `style.css` and
`script.js`. This document maps the 3,363-line script and the UI it drives so a change
can be made without reading everything.

## 1. File map

| File | Lines | Contents |
| --- | --- | --- |
| `index.html` | 459 | head/meta and Google Fonts (1–31), shell/HUD/ticker/rail/grid/studio/footer (32–459) |
| `style.css` | 2,641 | tokens/base (1–165), shell/top bar (166–312), buttons/forms (313–444), HUD (445–575), ticker (576–689), layout/rail (690–822), content/grid (823–1141), studio/panels (1142–2273), footer/toast (2274–2361), animations (2362–2391), responsive (2392–2641) |
| `script.js` | 3,363 | data (9–629), state/storage (641–748), UI refs (754–962), utilities (964–1036), SRS (1038–1186), HUD/grid (1188–1436), studio (1438–1601), feed (1603–1787), examples (1788–2092), activities (2094–3021), files/events/boot (3023–3363) |
| `state.json` | 124 | build metadata, token snapshot, artifact list — **not read by the app** |
| `STATE.md` | 72 | human-readable build/verification snapshot |

## 2. Data model

`RAW_WORDS` (`script.js:9–510`) is 500 tuples:

```js
["sanction", "WP", "ˈsæŋkʃən", "sanc|tion",
 "An official penalty imposed on a country to force a change in policy."]
// [word, beat, IPA, syllable chunks, definition]
```

`WORDS` (`602–629`) derives:

```js
{
  id, word, cat, catLabel, catShort, color,
  ipa, syllables: string[], definition,
  headline,          // one of five beat templates
  examples,          // 2 beat examples + definition sentence + headline = 4
  search             // word + definition + category, lowercase
}
```

Beats and their colours/templates live in `CATEGORY_META` (`524–589`). Ranks live in
`RANKS` (`591–596`): Intern (0), Field Journalist (25), Senior Editor (100), Anchor
(250).

One progress object is persisted:

```js
state = {
  version: 1,
  createdAt, updatedAt,
  words: { "1": { status, lastReviewed, reviewCount, nextReviewDue }, … "500" },
  streak: { count, best, lastDate, history: [] },
  stats: { attempts, correct },
  settings: { theme: "dark"|"light", fontScale: 0.8…1.4 }
}
```

`makeState(saved)` (`654`) fills all 500 word records, then validates and merges any
saved values. Invalid counts, dates, themes or font scales fall back to defaults.
`isIsoDate()` (`641`) checks dates before acceptance.

## 3. Storage

| Key | Where | Shape | Lifetime |
| --- | --- | --- | --- |
| `voa-newsroom.progress.v1` | `localStorage` | the state object above | until reset/import |
| `voa-newsroom.feed.v1` | `sessionStorage` | `{at: number, items: [{title, description, link, pubDate}]}` | 15 minutes (`FEED_TTL_MS`) |

`readSavedState()`/`saveState()` wrap access in `try/catch`; private mode or quota
failure leaves the app usable but shows an export warning. Imports replace `state`
wholesale after checking that at least one recognized word exists. Per-sentence solved
ticks are **not** in this object; they are UI-session `Set`s (`ui.sentenceSolvedKeys`,
`ui.sentenceSrsKeys`).

## 4. SRS

| Review count | Level | `intervalDays()` | Status |
| ---: | --- | ---: | --- |
| 0 | New | — | New, due now |
| 1 | L1 | +1 day | Practicing |
| 2–3 | L2 | +3 days | Practicing |
| 4–5 | L3 | +7 days | Practicing |
| 6+ | L4 | +30 days | Mastered |

- `isDue()` (`1046`) is `Date.parse(nextReviewDue) <= Date.now()`; invalid/missing dates
  count as due.
- `completeWord(wordId, activity, correct)` (`1143`) increments `reviewCount` and
  `stats.correct`, updates `nextReviewDue`, updates the daily streak and saves. An
  incorrect answer sets `nextReviewDue` to now and increments `stats.attempts`.
- `recordMiss()` (`1118`) is the lighter miss path used by activities: it timestamps,
  increments attempts, saves and re-renders but does not increment the review count.
- `isMastered()` is `reviewCount >= 6`, not a stored boolean; the persisted `status`
  string is derived/kept in sync for compatibility.

## 5. UI and grid

- **Views** — All 500, Due today, Practicing, Mastered (`setView`, `1304`).
- **Filters** — category tabs and rail beats (`setCategory`, `1311`), search with a
  120 ms debounce, and five sort modes (`getFilteredWords`, `1335`).
- **Pagination** — `PAGE_SIZE = 36`; `renderGrid()` shows
  `list.slice(0, page * 36)` and the Load More button increments `page`.
- **Cards** — `wordCardHTML()` (`1383`) renders category, status, word, IPA, definition
  excerpt, review count and due label.
- **HUD** — `renderHUD()` (`1192`) computes mastered count, percent, rank, due count,
  review streak, today's reviews and accuracy from `attempts/correct`.
- **Studio** — a fixed modal. `selectWord()` resets per-word activity state, renders the
  grid (selected card), renders the studio and opens the modal. `trapStudioFocus()`
  keeps Tab inside; `closeStudio()` returns focus to the originating card.
- **Activity tabs** — six `role="tab"` buttons; `setActivity()` shows one panel and
  calls its renderer.

## 6. Live feed and example sources

### Ticker

`loadFeed(false)` (`1698`) runs ~700 ms after boot:

1. Read `sessionStorage` cache if younger than 15 minutes.
2. Otherwise `fetch(FEED_URL)` with a 10 s `AbortController`, `cache: "no-store"`.
3. Require `data.status === "ok"` and an array; take the first 30 items.
4. `cleanFeedText()` parses HTML descriptions with `DOMParser` and collapses whitespace.
5. `safeVoaUrl()` accepts only `https:` URLs on `voanews.com` (including subdomains).
6. `applyFeed()` recomputes live word matches, renders the ticker and caches.
7. Any failure leaves the last feed in place and switches the label to
   “Live feed offline · cached headlines” or “archive mode”.

`matchesWord()` handles simple plurals/`-ed`/`-ing` and word boundaries;
`highlightWord()` wraps matches in `<mark>` after escaping the source text. The ticker
duplicates the first 12 items for a seamless marquee.

### Read-aloud examples

`getReadCandidates()` (`1933`) orders candidates: live VOA matches, cached web examples,
then the four built-in examples. `refreshReadExample()` (`1974`) fetches the three web
sources on first use, then advances the index. `fetchMoreExamples()` (`2034`) calls the
Wikipedia search API with an offset and appends filtered results.

| Source | Endpoint | Timeout / shape |
| --- | --- | --- |
| Free Dictionary | `api.dictionaryapi.dev/api/v2/entries/en/{word}` | 8 s |
| Wiktionary | `en.wiktionary.org/api/rest_v1/page/definition/{word}` | 8 s |
| Wikipedia summary | `en.wikipedia.org/api/rest_v1/page/summary/{word}` | 8 s |
| Wikipedia search | `en.wikipedia.org/w/api.php?action=query&generator=search…` | 8 s, 5 pages/batch |

`filterWebExamples()` keeps sentences 24–280 characters, at least four words, containing
the target word, de-duplicated by normalized text.

## 7. Activities

| Desk | Entry points | Completion |
| --- | --- | --- |
| 01 Read | `startRecognition` (2154), `evaluateRead` (2250), manual fallback | ≥72% transcript match or manual “mark practiced” → `completeWord` |
| 02 Listen | `playListenWord` (2404), `checkListenAnswer` (2421) | exact normalized word → `completeWord`; replay/reveal available |
| 03 Editor | `renderEditorPanel` (2489), `checkEditorAnswer` (2533) | correct option or typed word → `completeWord` |
| 04 Match | `startMatch` (2670), `handleMatchDefinition` (2717) | 60 s timer, five pairs/board, mismatches −2 s; correct pair → `completeWord` |
| 05 Syllables | `renderSyllablePanel` (2773), `playSyllable`/`playAllSyllables` | playback only; stress chunk derived from the IPA `ˈ` position |
| 06 Sentence | `renderSentencePanel` (2896), `checkSentenceAnswer` (2940) | first solve per word+sentence → `completeWord`; reset keeps the SRS key |

The read/listen/editor desks keep a per-word `solved` flag so repeated actions do not
double-count SRS. Sentence practice keys by `wordId::normalizedSentence` instead, so
each example can be filed once.

## 8. Progress files

`saveProgressFile()` (`3027`) wraps the state in:

```json
{
  "app": "VOA Newsroom: 500 Words ESL Studio",
  "version": "1.0.0",
  "exportedAt": "…",
  "state": { … }
}
```

It downloads as `voa_learning_progress.txt` with MIME `text/plain`. `importProgressFile()`
(`3052`) accepts either `{state: …}` or a bare state object, requires a `words` object
with at least one recognized id, then calls `makeState()` so all 500 records exist.
Theme, font scale, streak, stats and word records are restored; per-sentence UI ticks
are not.

## 9. Change guide

| To change… | Touch | Watch out for |
| --- | --- | --- |
| Word list or beats | `RAW_WORDS`, `CATEGORY_META` | ids are array order; all 500 expected |
| Headline/example templates | `CATEGORY_META.templates` / `.examples` | `WORDS` assumes two beat examples + definition + headline |
| SRS intervals or mastery | `intervalDays`, `isMastered`, `levelLabel` | update README table and tests |
| Ranks | `RANKS` | progress UI text uses `nextAt` |
| Feed proxy or cache | `FEED_URL`, `FEED_TTL_MS`, `loadFeed` | keep archive fallback and URL allow-list |
| Example sources | fetch functions + `getReadCandidates` | preserve built-in fallback; keep CORS in mind |
| Grid cards/view filters | `wordCardHTML`, `getFilteredWords`, `renderGrid` | 36-per-page pagination |
| Studio layout | `index.html` studio block + CSS 1142–2273 | focus trap and Escape close |
| Progress shape | `makeState`, `STORAGE_KEY` | bump the key version, keep import validation |
| Deployment | none in-app | Pages is branch-root; no build artifact |

Do not add a framework, backend or required network call. The offline core is the
contract.
