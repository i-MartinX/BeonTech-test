# BeonTech-test

POC comparing **Playwright** and **Cypress** (TypeScript) on the same scenarios against public targets:

- UI: https://www.saucedemo.com
- API: https://restful-booker.herokuapp.com

## Scripts

| Command | What it does |
|---|---|
| `npm run test:pw` | Playwright (chromium, firefox, webkit) |
| `npm run test:cy` | Cypress (Electron) |
| `npm run test:all` | Both, then merges results into `reports/results.json` |
| `npm run merge` | Merge Playwright + Cypress results only |
| `npm run report:data` | Merge results into the report app (`report/src/data/results.json`) |
| `npm run report:dev` | Run the report app locally (Vite) |
| `npm run report:cypress-html` | Cypress HTML report from the mochawesome JSON |
| `npm run report:build` + `report:site` | Build the report and assemble the Pages site in `site/` |
| `npm run typecheck` | `tsc --noEmit` |

Reports are written to `reports/` (git-ignored).

## Scenarios

Both tools run the same 17 scenarios (`shared/data.ts` holds the test data). Titles carry an ID
(`[API-01]`, `[UI-01]`...) so results can be matched across tools.

- **API (7)** - Restful-Booker: health, create, get, schema, update, delete, bad auth
- **UI (7)** - SauceDemo: login (ok / locked / invalid), sort, cart badge, checkout, network failure
- **Visual (3)** - screenshot comparison in headless mode: inventory page, login error, order confirmation

Playwright runs the UI scenarios on Chromium, Firefox and WebKit; Cypress runs on Electron.

## Local gotcha (VS Code terminal)

VS Code sets `ELECTRON_RUN_AS_NODE=1`, which breaks Cypress ("bad option: --smoke-test").
Unset it before running Cypress locally:

```powershell
Remove-Item Env:ELECTRON_RUN_AS_NODE
```

## Visual checks

- Playwright uses `toHaveScreenshot` (per browser). Cypress has no built-in, so `cypress.config.ts` has a
  `compareSnapshot` task using `pixelmatch` (1% pixel tolerance, diff image in `reports/cypress-diffs/`).
- Both run headless at a fixed 1280x720 viewport.
- Baselines are stored per OS (`playwright/__screenshots__/<os>/...`, `cypress/snapshots/<os>/`) because font
  rendering differs between Windows and Linux. Create or refresh them with:

```powershell
npm run test:pw:update
npm run test:cy:update
```

## The report (`report/`)

Vite + React + TypeScript + Tailwind, animated with GSAP. It reads `report/src/data/results.json`, which
`npm run report:data` generates from the test runs. The committed copy is a real local run, so the app builds
without running any tests.

```powershell
npm run test:all        # run both tools and merge
npm run report:data     # refresh the app's data and baseline screenshots
npm run report:dev      # http://localhost:5173
```

`scripts/record-demo.ts` records the checkout clip shown in the report (`npx tsx scripts/record-demo.ts`).

## CI and GitHub Pages

`.github/workflows/ci.yml` runs on every push to `master`, on pull requests, and manually:

1. **playwright** and **cypress** run in parallel, headless, and upload their reports.
2. **report** merges the results, builds the React report, adds both native HTML reports under `/native/`, and
   publishes the site. Every run also gets a results table on its summary page and a downloadable `site` artifact.
3. **deploy** publishes to GitHub Pages (`master` only).

One-time setup: **Settings > Pages > Build and deployment > Source: GitHub Actions**.

Linux visual baselines are created by CI the first time it runs (and whenever you trigger the workflow manually
with *Regenerate the Linux screenshot baselines* ticked), then committed back with `[skip ci]`. That needs
**Settings > Actions > General > Workflow permissions > Read and write**.

## Brand and credits

The report uses the BEON.tech brand, taken from beon.tech: Plus Jakarta Sans; navy `#20222d`, blue `#3a69ff`,
violet `#7432ff`, light grey `#f4f5f7`; green `#39b96a` for passes and red `#ff3a3a` for failures.
Logos live in `report/public/brand/` and are used unmodified, only to identify each product:

| File | Source |
| --- | --- |
| `beon-mark.svg`, `beon-wordmark.webp` | beon.tech |
| `playwright-logo.svg` | playwright.dev |
| `cypress-wordmark-white.svg` | docs.cypress.io |
| Cypress "cy" mark (inline SVG) | Simple Icons (CC0) |

BEON.tech, Playwright and Cypress names and logos belong to their owners.
