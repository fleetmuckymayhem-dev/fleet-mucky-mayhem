import { defineConfig } from 'astro/config';
const staging = process.env.FMM_STAGING === '1';
export default defineConfig({
  output: 'static', compressHTML: false, devToolbar: { enabled: false },
  ...(staging ? {
    site: process.env.FMM_STAGING_SITE || 'https://martin-ferrero-thompson.github.io',
    base: '/staging-fleet-mucky-mayhem',
    outDir: './artifacts/staging-site',
  } : {}),
});
