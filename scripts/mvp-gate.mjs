import { spawnSync } from 'node:child_process';

// Run the automated gates sequentially: Next.js build and dev server share .next.
const checks = [
  ['production dependency audit', 'npm', ['audit', '--omit=dev', '--audit-level=high']],
  ['production build', 'npm', ['run', 'build']],
  ['browser tests', 'npx', ['--no-install', 'playwright', 'test', '--workers=1']],
];
let failed = false;
for (const [name, command, args] of checks) {
  console.log(`\n--- ${name} ---`);
  const result = spawnSync(command, args, { stdio: 'inherit', env: process.env });
  if (result.error || result.status !== 0) {
    console.error(`${name}: FAILED`, result.error?.message || result.status);
    failed = true;
  } else console.log(`${name}: PASSED`);
}

// These gates need product-specific evidence; do not infer readiness from a build.
console.error('\nMVP readiness: BLOCKED pending verified image editing, text editing, undo/redo, complete Arabic/English UX, and individual asset licenses.');
process.exitCode = failed ? 1 : 2;
