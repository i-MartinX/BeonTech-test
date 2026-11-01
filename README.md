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
