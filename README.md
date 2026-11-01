# BeonTech-test

POC comparing **Playwright** and **Cypress** (TypeScript) on the same scenarios against public targets:

- UI: https://www.saucedemo.com
- API: https://restful-booker.herokuapp.com

## Scripts

| Command | What it does |
|---|---|
| `npm run test:pw` | Playwright (chromium, firefox, webkit) |
| `npm run test:cy` | Cypress (Electron) |
| `npm run test:all` | Both |
| `npm run typecheck` | `tsc --noEmit` |

Reports are written to `reports/` (git-ignored).

## Local gotcha (VS Code terminal)

VS Code sets `ELECTRON_RUN_AS_NODE=1`, which breaks Cypress ("bad option: --smoke-test").
Unset it before running Cypress locally:

```powershell
Remove-Item Env:ELECTRON_RUN_AS_NODE
```
