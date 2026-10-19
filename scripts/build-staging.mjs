import { spawnSync } from 'node:child_process';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
// Reuse the normal validated build, with a separate output folder and Pages base.
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Run this through npm run build:staging.');
const result = spawnSync(process.execPath, [npmCli, 'run', 'build'], {
  cwd: root, env: { ...process.env, FMM_STAGING: '1' }, stdio: 'inherit',
});
if (result.status !== 0) process.exit(result.status ?? 1);
const output = new URL('../artifacts/staging-site/', import.meta.url);
writeFileSync(new URL('.nojekyll', output), '');
const html = readFileSync(new URL('index.html', output), 'utf8');
if (!html.includes('noindex, nofollow') || !html.includes('/staging-fleet-mucky-mayhem/_astro/')) {
  throw new Error('Staging build is missing its search-indexing tag or Pages asset prefix.');
}
const files = readdirSync(output, { recursive: true });
if (files.some(file => /(?:^|[\\/])(?:\.git|node_modules|src)(?:[\\/]|$)|\.map$/.test(String(file)))) {
  throw new Error('Staging output contains source, dependencies, Git history or source maps.');
}
console.log('Staging site prepared in artifacts/staging-site (built files only).');
