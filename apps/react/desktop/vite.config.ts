/* eslint-disable unicorn/prefer-module */
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { replaceFiles } from '@nx/vite/plugins/rollup-replace-files.plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/apps/react/desktop',
  server: {
    port: 4300,
    host: 'localhost',
    fs: {
      strict: false,
    },
  },
  preview: {
    port: 4301,
    host: 'localhost',
  },
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    viteStaticCopy({
      targets: [
        {
          src: '../../../node_modules/epubjs-reader/reader/js/libs/*.min.js',
          dest: 'assets/reader/js',
        },
        {
          src: '../../../node_modules/epubjs-reader/reader/js/epub.min.js',
          dest: 'assets/reader/js',
        },
        {
          src: '../../../node_modules/epubjs-reader/reader/js/reader.min.js',
          dest: 'assets/reader/js',
        },
        {
          src: '../../../node_modules/epubjs-reader/reader/css/main.css',
          dest: 'assets/reader/css',
        },
        {
          src: '../../../node_modules/epubjs-reader/reader/css/popup.css',
          dest: 'assets/reader/css',
        },
        {
          src: '../../../node_modules/epubjs-reader/reader/font/',
          dest: 'assets/reader',
        },
      ],
    }),
    process.env.NODE_ENV === 'production' &&
      replaceFiles([
        {
          replace: 'libs/shared/environments/src/lib/environment.ts',
          with: 'libs/shared/environments/src/lib/environment.prod.ts',
        },
      ]),
    process.env.NODE_ENV === 'testing' &&
      replaceFiles([
        {
          replace: 'libs/shared/environments/src/lib/environment.ts',
          with: 'libs/shared/environments/src/lib/environment.testing.ts',
        },
      ]),
  ],
  publicDir: '../../../libs/shared/assets/',
  build: {
    outDir: '../../../dist/apps/react/desktop',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
