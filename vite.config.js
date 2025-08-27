import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import paths from './config/paths';
import zipBuild from './scripts/zip.js'
import pkgJson from './package.json';

const APP_DIR = paths.appSrc;

export default defineConfig({
  plugins: [
    react(),
    zipBuild({
      folderPath: 'dist',
      outPath: `${pkgJson.name}.zip`,
    })
  ],
  server: {
    open: true,
  },
  resolve: {
    alias: {
      '@background': `${APP_DIR}/background`,
      '@content': `${APP_DIR}/content`,
      '@utils': `${APP_DIR}/utils`,
    },
  },
  build: {
    rollupOptions: {
      input: {
        background: path.resolve(APP_DIR, 'background', 'index.js'),
        content: path.resolve(APP_DIR, 'content', 'index.jsx'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})
