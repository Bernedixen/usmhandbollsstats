# Handball Stats

Offline-first web app scaffold for tracking USM F14 stage 4, built so it can later be wrapped with Capacitor for iOS.

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

Use any static file server, for example:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Live data note

Direct browser fetch to Profixio may fail because of cross-origin restrictions. That is expected for a pure web app. Once the app is wrapped with Capacitor, the same source logic can be routed through a native HTTP plugin to make the live sync much more reliable.

## Next useful steps

1. Add match-level parsing for each Stage 4 group once the exact Profixio group pages are confirmed.
2. Add standings, goal difference, and qualification watch summaries.
3. Add a small build tool such as Vite before introducing Capacitor.
