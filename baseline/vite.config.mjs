import { defineConfig } from 'vite-baseline';
import { cpSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const path = relative => fileURLToPath(new URL(relative, import.meta.url));
export default defineConfig({ root: path('./src'), publicDir: false,
  build: { outDir: path('./dist'), emptyOutDir: true },
  plugins: [{ name: 'baseline-static-assets', closeBundle() {
    for (const folder of ['data', 'img']) cpSync(path('./src/' + folder), path('./dist/' + folder), { recursive: true });
  } }]
});
