# Handball Stats

Offline-first web app scaffold for tracking USM F14 stage 4, prepared so it can later be wrapped with Capacitor for iOS.

## Current focus

- USM F14, girls born 2011
- Stage 4 A overview with the eight qualifying groups
- District representation summary
- Team and district filters
- Local official snapshot bundled in `data/usm-f14-stage4-2026.json`
- Optional live fetch attempt from the public Profixio competition page

## Why this is structured for Capacitor later

- Static assets only: `index.html`, `styles.css`, `app.js`, `data/*.json`
- No backend requirement for the base experience
- Source adapter pattern in `app.js`, so browser fetch can later be replaced by Capacitor native HTTP
- Relative paths for all local assets

## Run locally during development

Preferred for live Profixio refresh during desktop development:

```powershell
node server.js
```

Then open `http://localhost:8000`.

The local server does two things:

- serves the static app
- proxies Profixio requests through same-origin `/api/profixio/*` endpoints

Fallback if you only want the local bundled snapshot:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Capacitor-ready structure

- `npm run build` copies the web assets into `dist/`
- `capacitor.config.json` points Capacitor at `dist/`
- `manifest.webmanifest` and iOS-friendly meta tags are already in place
- `server.js --dist` can serve the built app locally if you want to test the packaged web output

## Live data note

Direct browser fetch to Profixio may fail because of cross-origin restrictions. The included `server.js` avoids that in local development by fetching Profixio server-side.

Inside Capacitor, the app now prefers native HTTP for:

- the main Profixio competition page
- the Stage 3 A and Stage 3 B table pages used to derive `GD`

That means the iPhone app no longer has to depend on the local `/api/profixio/*` proxy for live refresh.

## Typical Capacitor flow

When you are ready to move toward iPhone packaging:

```powershell
npm run build
npx cap init
npx cap add ios
npx cap copy ios
```

Then open the generated Xcode project on a Mac.

Note:

- Capacitor dependencies and the generated `ios/` project are already in this repo.
- Desktop live refresh still uses the local Node proxy.
- The Capacitor app is set up to try native HTTP first for live Profixio refresh.

## Next useful steps

1. Add match-level parsing for each Stage 4 group once the exact Profixio group pages are confirmed.
2. Add standings, goal difference, and qualification watch summaries.
3. Add a small build tool such as Vite before introducing Capacitor.
