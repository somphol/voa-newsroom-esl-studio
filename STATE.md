# Build State

| Field | Value |
| --- | --- |
| Project | VOA Newsroom: 500 Words ESL Studio (`voa-newsroom-esl-studio`) |
| Started | 2026-10-31 23:15:39 UTC |
| Completed | 2026-11-01 01:23:54 UTC |
| Duration | **2h 8m 15s** (7,694.5 seconds) |
| Harness | OpenCode 2.2.5 |
| Model | DeepSeek V4.1 Flash (`opencode-go/deepseek-v4.1-flash`) |
| Session | `ses_e6bc0b0c3ffeBbI7KPINLa6RIR` |
| Repository | <https://github.com/somphol/voa-newsroom-esl-studio> |
| Live demo | <https://somphol.github.io/voa-newsroom-esl-studio/> |

## Token usage

| Metric | Tokens |
| --- | ---: |
| Input | 122,848 |
| Output | 160,790 |
| Reasoning | 141,436 |
| **Total (input + output + reasoning)** | **425,074** |
| Cache read | 118,882,304 |
| Cache write | 1,645 |
| Total including cache | 119,309,023 |

> Snapshot taken from the OpenCode session record when the project was packaged at 2026-11-01 01:23:54 UTC. The final commit/push and the closing response occur outside this snapshot, so the live session totals will be marginally higher. `total = input + output + reasoning`; cache reads/writes are reported separately because they are a subset of context usage.

## What was built

- **Three production files**: `index.html` (447 lines), `style.css` (2,641 lines), `script.js` (3,363 lines). No build step, no framework, no backend, no database.
- **500 curated words**, exactly 125 per beat: World Politics, Business & Economy, Science & Tech, and Culture. Every entry has a definition, IPA, visual syllable chunks, a category headline template, and four example sentences.
- **Six learning desks**:
  - Anchor Read-Aloud with `webkitSpeechRecognition`, transcript feedback, accuracy meter, and SRS update.
  - Listening Desk with `SpeechSynthesisUtterance` at 0.5× / 0.8× / 1.0× and dictation checking.
  - Copy Editor with blanked headlines, multiple-choice options, and typed answers.
  - Speed Match Ticker with a 60-second clock, five pairs per board, penalties, and rolling rounds.
  - Syllable & Phonetic Explorer with tappable chunks, IPA, stress highlighting, and syllable-by-syllable playback.
  - Sentence Practice with four examples per word, refresh cycling, sentence audio, fill-in-the-blank checking, per-sentence solved tracking, and a reset control.
- **Comfort controls**: 80%–140% text scaling, persisted in local progress and progress-file exports.
- **Example sentence bank**: definition, context, and headline examples for every word, refreshable from the word dossier or the sentence desk.
- **SRS engine** with `status`, `lastReviewed`, `reviewCount`, and `nextReviewDue`; intervals of 1 / 3 / 7 / 30 days and a Due Today queue filtered by timestamp.
- **Live VOA integration** through `https://api.rss2json.com/v1/api.json?rss_url=https://learningenglish.voanews.com/api/`, with headline/snippet matching, a glowing live badge, target-word highlighting, direct VOA links, 15-minute session caching, and embedded headline fallbacks.
- **Read-aloud example refresh** cycles live VOA matches and fetches additional sentences from the Free Dictionary API, Wiktionary, and Wikipedia; built-in examples remain the offline fallback.
- **On-demand example paging**: the **➕ More examples** button pulls successive Wikipedia search batches and appends them to the per-word cache, so users can keep expanding the example pool.
- **Reporter HUD**: Intern → Field Journalist → Senior Editor → Anchor, mastery out of 500, daily streak, accuracy, and review totals.
- **Portable progress**: automatic `localStorage` saves, `voa_learning_progress.txt` export, and file import with validation.
- **Newsroom UI**: navy/slate glassmorphism, VOA red accents, editorial serif headlines, responsive layouts, light/dark themes, reduced-motion support, keyboard navigation, and ARIA labels.
- **Focused word studio modal**: a 1280px desktop / near-full-screen mobile dialog with a word dossier, vertical activity rail, backdrop and Escape closing, focus trap, and focus return to the originating card.

## Verification

- 500 unique words; 125 per category; no missing IPA, syllable, or definition fields.
- SRS intervals verified in-browser: `1, 3, 3, 7, 7, 30, 30`; sixth successful review sets `Mastered` and a 30-day due date.
- Chrome headless smoke tests passed with no console errors: 36 cards rendered, all six panels opened, speed match scored, syllable playback ran, and sentence practice updated the SRS.
- Sentence bank verified: four examples per word, refresh cycling, sentence audio, fill-in-the-blank checking, and SRS update.
- Font size control verified from 80% to 140%, persisted through reload and progress export/import.
- Live RSS returned real VOA Learning English items; a matching word showed the live badge and a valid `learningenglish.voanews.com` link.
- Read-aloud refresh verified against live VOA, Free Dictionary API, Wiktionary, and Wikipedia, with offline fallback to built-in examples.
- On-demand paging verified: the first “More examples” batch added 29 Wikipedia sentences and a second batch added 9 more for the same word.
- Per-sentence tracking verified: solving example 1 and example 2 both filed, refreshing to example 1 showed its solved state, and resetting/re-solving it kept the SRS count unchanged.
- Export produced `voa_learning_progress.txt` with 500 word records; import restored it successfully.
- Responsive checks at 1600px, 1440px, 1024px, and 390px; mobile HUD stacks and the word studio opens as a near-full-screen modal.
- Word studio modal verified at 1280px wide / 640px tall on desktop and 370px wide on mobile, with backdrop close, Escape close, focus trap, and focus return.
- Text scaling verified at 80%–140% on desktop and mobile, including a 140% mobile pass with no horizontal overflow.
- GitHub Pages build completed and served `index.html`, `style.css`, `script.js`, and `screenshot.png` with HTTP 200.

## Credits

Built with [OpenCode](https://opencode.ai) and **DeepSeek V4.1 Flash**. The app, data set, SRS engine, speech activities, live-feed matching, responsive design, tests, and documentation were generated in a single agent session.

Live headlines are provided by [VOA Learning English](https://learningenglish.voanews.com/) through its public RSS feed and the [rss2json](https://rss2json.com/) client endpoint. This is an independent learning project and is not an official VOA product.
