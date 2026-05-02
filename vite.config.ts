import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

const _monacoEditorPlugin = monacoEditorPlugin as any;

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    _monacoEditorPlugin.default({
      languages: ['css']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
