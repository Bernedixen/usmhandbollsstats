# Handball Stats

Offline-first web app scaffold for tracking USM F14 stage 4, prepared so it can later be wrapped with Capacitor for iOS.

## Current focus

- USM F14, girls born 2011
- Stage 4 A overview with the eight qualifying groups
- District representation summary
- Team and district filters
- Local official snapshot bundled in `data/usm-f14-stage4-2026.json`
- Bundled Stage 3 goal differences captured from Profixio and stored directly in the app

## Why this is structured for Capacitor later

- Static assets only: `index.html`, `styles.css`, `app.js`, `data/*.json`
- No backend requirement for the base experience
- Relative paths for all local assets

## Run locally during development

Serve the static app locally:

```powershell
node server.js
```

Then open `http://localhost:8000`.

## Deploy to Render

This repo is set up for a simple Render web service deploy.

Files involved:

- `render.yaml`
- `package.json` with `npm start`
- `server.js --dist` serving the built app

Typical Render flow:

1. Push this repo to GitHub.
2. In Render, create a new Blueprint or Web Service from the repo.
3. Render will use:
   - build command: `npm install`
   - start command: `npm start`
4. After deploy, open the Render URL on iPhone or desktop.

Notes:

- `npm start` runs the build first, then starts `server.js --dist`.
- The deployed app now uses bundled data only, so Render behaves the same as local and offline.

The local server does two things:

- serves the static app

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
- The app currently uses bundled data and does not require live fetch support.

## Next useful steps

1. Add match-level summaries for each Stage 4 group.
2. Add qualification watch summaries using the bundled Stage 1-3 data.
3. Add a small build tool such as Vite before introducing Capacitor.
