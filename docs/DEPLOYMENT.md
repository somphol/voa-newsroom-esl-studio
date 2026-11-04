# Deployment

Hosted on **GitHub Pages** straight from the repository. There is no build, artifact,
package manager or CI workflow: what is committed on `main` is what is served.

- Live URL: <https://somphol.github.io/voa-newsroom-esl-studio/>
- Repository: <https://github.com/somphol/voa-newsroom-esl-studio>
- Source branch: `main`, folder `/` (repository root)
- Entry file: `index.html`
- Pages source: **Deploy from a branch** (`main` / root), not GitHub Actions

## 1. Deploy a change

```bash
cd ~/Projects/voa-newsroom-esl-studio

# 1. verify locally
python3 -m http.server 8000        # http://localhost:8000/
#    run the manual matrix in docs/TESTING.md

# 2. commit and push
git add -A
git commit -m "…"
git push origin main
```

Pages rebuilds on push, usually within a minute. Confirm:

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://somphol.github.io/voa-newsroom-esl-studio/
shasum index.html
curl -sL https://somphol.github.io/voa-newsroom-esl-studio/ | shasum
```

At the time of writing the live root SHA-1 was
`c06ad9214cdf016abe19076ab240e9a7a18b5c30`, identical to the local `index.html`.

## 2. Repository settings that matter

| Setting | Value | Why |
| --- | --- | --- |
| Pages source | Deploy from a branch → `main` → `/ (root)` | the app is three files at the root |
| Custom domain | none | default `*.github.io` host |
| Enforce HTTPS | on | default certificate |
| Actions | none | no workflow exists in `.github/workflows/` |
| Jekyll | disabled by `.nojekyll` | avoids processing the static files |

`.nojekyll` is committed. Keep it.

## 3. What is published

Because the branch root is served, **the entire repository is public**, including:

- `index.html`, `style.css`, `script.js` — the application
- `favicon.svg` — local icon
- `screenshot.png`, `screenshot-mobile.png`, `screenshot-read.png`,
  `docs/social-card.png` — README/social images
- `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`,
  `LICENSE`, `AGENTS.md`, `docs/*.md`
- `STATE.md`, `state.json` — build metadata and token snapshot
- `robots.txt`, `sitemap.xml`

`state.json` and `STATE.md` are **not read by the app**. They contain build timing,
session/model names and token counts (no credentials, secrets or personal data), but
they are published because the whole root is. If that is undesirable, move them into a
non-published directory or remove them.

There is no environment file, API key or runtime configuration. External requests are
made directly from the browser:

| Destination | When | Required? |
| --- | --- | --- |
| `fonts.googleapis.com`, `fonts.gstatic.com` | every page load | no — system-font fallback |
| `api.rss2json.com` (VOA RSS proxy) | ticker load/refresh | no — archive mode |
| `api.dictionaryapi.dev` | read-aloud refresh | no — built-in examples |
| `en.wiktionary.org` | read-aloud refresh | no — built-in examples |
| `en.wikipedia.org` | read-aloud refresh / More examples | no — built-in examples |

The app is therefore **offline-capable for its core**, but not fully self-contained.

## 4. Rollback

Pages serves the current `main`, so rolling back is a normal history operation:

```bash
git revert <bad-commit>          # preferred: keeps history
git push origin main
```

or, for an immediate local reset:

```bash
git reset --hard <good-commit>
git push --force-with-lease origin main
```

Force-pushing rewrites the published history; prefer `git revert` unless the bad commit
contains something that must not remain public.

## 5. Caching

The live document returned:

```text
cache-control: max-age=600
etag: "6ae76b5e-683c"
last-modified: Sun, 01 Nov 2026 16:39:58 GMT
```

A browser may keep an old `index.html` for up to ten minutes. Hard-refresh
(Shift-Reload) or use a private window after deploying. There is no service worker and
no offline cache to invalidate; the feed cache lives in `sessionStorage` and expires
after 15 minutes.

## 6. Local preview versus production

The app works from `file://` for the core (grid, SRS, storage, speech where supported),
but a server is recommended:

```bash
python3 -m http.server 8000
```

Use HTTP when testing the RSS request, speech APIs and clipboard-like permissions;
`file://` origins behave differently in some browsers. The feed and Google Fonts still
need network access. To test the offline path deliberately:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu \
  --host-resolver-rules="MAP * ~NOTFOUND, EXCLUDE localhost" \
  --virtual-time-budget=5000 --dump-dom "http://localhost:8000/"
```

Expect 36 cards and “Live feed offline · archive mode”.

## 7. Platform requirements

- Modern browser with JavaScript, `localStorage` and (ideally) `sessionStorage`.
- Speech synthesis: Chrome, Edge, Safari; voices vary by OS.
- Speech recognition: Chrome/Edge only; other browsers get the practice fallback.
- CSS `backdrop-filter`, `dvh` and animations degrade gracefully.
- No WebGL and no server-side component.
