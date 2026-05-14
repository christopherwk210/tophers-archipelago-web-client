import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader'
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

const _monacoEditorPlugin = monacoEditorPlugin as any;

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    svgLoader(),
    _monacoEditorPlugin.default({
      languages: ['css']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    allowedHosts: true
  }
});
