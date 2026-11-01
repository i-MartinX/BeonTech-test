/**
 * Runs both suites even if one fails (so the comparison is always complete),
 * merges the results, then exits non-zero if any step failed.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

fs.rmSync('reports', { recursive: true, force: true });

const steps = ['test:pw', 'test:cy', 'merge'];
let failed = false;

for (const step of steps) {
  console.log(`\n=== npm run ${step} ===`);
  const res = spawnSync('npm', ['run', step], { stdio: 'inherit', shell: true });
  if (res.status !== 0) failed = true;
}

process.exit(failed ? 1 : 0);
