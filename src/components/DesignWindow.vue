<script setup lang="ts">
import { ui } from '@/state/ui';
import { useDraggable, useEventListener } from '@vueuse/core';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import { customCSS, setCustomCSS } from '@/lib/theme';
import { saveAs } from 'file-saver';
import { useLocalization } from '@/lib/localization-util';

const { t } = useLocalization();

let monaco: typeof import('monaco-editor/esm/vs/editor/editor.api') | null = null;
let editor: import('monaco-editor').editor.IStandaloneCodeEditor | null = null;
let model: import('monaco-editor').editor.ITextModel | null = null;

let monacoLoading: Promise<void> | null = null;

const loadingEditor = ref(false);

async function loadMonaco() {
  if (monaco) return;

  if (!monacoLoading) {
    monacoLoading = (async () => {
      monaco = await import('monaco-editor/esm/vs/editor/editor.api');

      // language (both required)
      await import('monaco-editor/esm/vs/basic-languages/css/css.contribution');
      await import('monaco-editor/esm/vs/language/css/monaco.contribution');

      // core services
      await import('monaco-editor/esm/vs/editor/standalone/browser/standaloneServices');

      // features
      await import('monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestController');
      await import('monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu');
      await import('monaco-editor/esm/vs/editor/contrib/hover/browser/contentHoverController');
      await import('monaco-editor/esm/vs/editor/contrib/bracketMatching/browser/bracketMatching');

      // theme (define AFTER monaco is loaded)
      monaco.editor.defineTheme('custom-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'tag', foreground: 'd7ba7d' },
          { token: 'type', foreground: 'd7ba7d' },
          { token: 'entity.name.tag', foreground: 'd7ba7d' },
        ],
        colors: {}
      });
    })();
  }

  await monacoLoading;
}

function createEditor() {
  if (!monaco || !editorOutlet.value) return;

  // 🔥 create model ONCE
  if (!model) {
    model = monaco.editor.createModel(customCSS.value || '', 'css');
  }

  editor = monaco.editor.create(editorOutlet.value, {
    model, // 👈 use model instead of value
    automaticLayout: true,
    theme: 'custom-dark',
    tabSize: 2,
    contextmenu: true,
    fontLigatures: false
  });

  editor.onDidChangeModelContent(() => {
    const editorContents = model!.getValue();
    const customStyleTag = document.querySelector('style[data-tawc-custom-theme]');
    if (customStyleTag) {
      customStyleTag.textContent = editorContents;
    }
  });
}

import sampleTheme from '@/assets/sample-theme.css?raw';

const title = useTemplateRef('title');
const bottomRightDrag = useTemplateRef('bottom-right-drag');
const editorOutlet = useTemplateRef('editor-outlet');

const { x, y } = useDraggable(title, {
  initialValue: { x: 40, y: 40 },
  containerElement: document.body
});

const width = ref(450);
const height = ref(300);
const minWidth = ref(400);
const minHeight = ref(300);
const maxWidth = ref(document.documentElement.clientWidth - 100);
const maxHeight = ref(document.documentElement.clientHeight - 100);

const windowStyle = computed(() => {
  return {
    left: `${x.value}px`,
    top: `${y.value}px`,
    width: `${width.value}px`,
    height: `${height.value}px`,
    display: ui.design.windowOpen ? 'flex' : 'none'
  };
});

watch(() => ui.design.windowOpen, async () => {
  if (ui.design.windowOpen) {
    loadingEditor.value = true;

    await loadMonaco();
    if (!editor) {
      createEditor();
      requestAnimationFrame(() => {
        editor!.layout();
      });
    }

    // only sync external → model IF needed
    if (model && model.getValue() !== customCSS.value) {
      model.setValue(customCSS.value);
    }

    editor!.focus();

    loadingEditor.value = false;
  }
});

const resizingWindow = ref(false);

useEventListener(bottomRightDrag, 'pointerdown', event => {
  resizingWindow.value = true;
}, {
  capture: true,
  passive: true
});

useEventListener(window, 'pointermove', event => {
  if (!resizingWindow.value) return;

  const dx = event.movementX;
  const dy = event.movementY;

  width.value = Math.min(Math.max(width.value + dx, minWidth.value), maxWidth.value);
  height.value = Math.min(Math.max(height.value + dy, minHeight.value), maxHeight.value);
});

useEventListener(window, 'pointerup', event => {
  resizingWindow.value = false;
}, {
  capture: true,
  passive: true
});

function close() {
  ui.design.windowOpen = false;
  customCSS.value = model!.getValue();
  setCustomCSS(customCSS.value);
}

function reset() {
  const areYouSure = confirm(t('Theme.themeDesignerResetConfirm'));
  if (areYouSure) {
    model!.setValue('');
    editor!.focus();
  }
}

function download() {
  saveAs(new Blob([model!.getValue()], { type: 'text/css' }), 'tawc-custom-theme.css');
}

function loadSample() {
  const areYouSure = confirm(t('Theme.themeDesignerOverwrite'));
  if (!areYouSure) return;

  model!.setValue(sampleTheme);
  editor!.focus();
}
</script>

<template>
  <Teleport to="body">
    <div ref="container" :style="windowStyle" data-design-window>
      <div ref="title" data-design-window-title>
        <span style="padding-left: 0.5em">{{ t('Theme.themeDesignerTitle') }}</span>
        <div @click="close" data-design-window-close>✖</div>
      </div>
      <div data-design-window-body>
        <div data-design-window-toolbar>
          <div @click="download" data-design-window-toolbar-btn>{{ t('MiscUI.download') }}</div>
          <div @click="loadSample" data-design-window-toolbar-btn>{{ t('Theme.themeDesignerSample') }}</div>
          <div @click="reset" data-design-window-toolbar-btn>{{ t('Theme.themeDesignerReset') }}</div>
        </div>
        <div data-design-window-editor-outlet>
          <div v-if="loadingEditor" data-editor-loading>
            <div class="spinner"></div>
          </div>

          <div v-show="!loadingEditor" ref="editor-outlet" style="width: 100%; height: 100%;"></div>
        </div>
        <div ref="bottom-right-drag" data-design-window-bottom-right-drag></div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
[data-design-window], [data-design-window] * {
  box-sizing: border-box;
}

[data-design-window] {
  position: fixed;
  width: 300px;
  height: 300px;
  background: #1c2327;
  z-index: 50000;
  left: 50%;
  opacity: 0.9;
  color: white;
  user-select: none;
  -webkit-user-drag: none;
  border-radius: 6px;
  overflow: hidden;
  font-size: 16px;
  display: flex;
  flex-direction: column;
}

[data-design-window]:hover {
  opacity: 1;
}

[data-design-window-title] {
  background: black;
  cursor: move;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

[data-design-window-close] {
  padding: 4px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  text-align: center;
}

[data-design-window-close]:hover {
  background: #ce390e;
}

[data-design-window-body] {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

[data-design-window-bottom-right-drag] {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  cursor: nwse-resize;
  z-index: 2200;
  background: linear-gradient(135deg,
    transparent 0%,

    transparent 4px,
    white 5px,
    transparent 6px,

    transparent 9px,
    white 10px,
    transparent 11px,
    
    transparent 100%
  );
  background-position: center;
  background-size: 100% 100%;
}

[data-design-window-editor-outlet] {
  flex: 1;
  overflow: hidden;
}

[data-design-window-toolbar] {
  background: #252526;
  display: flex;
}

[data-design-window-toolbar-btn] {
  padding: 0.3em 2em;
  border-right: 1px solid #565657;
}

[data-design-window-toolbar-btn]:hover {
  background: #323233;
}

[data-design-window-toolbar-btn]:active {
  background: #1e1e1e;
}

[data-editor-loading] {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #aaa;
  font-size: 14px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #555;
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

<style>
/* Reset textarea styles */
[data-design-window] textarea {
  all: unset;
}

/* Temporarily remove monaco find widget tooltips */
/* https://github.com/microsoft/monaco-editor/issues/5137 */
/* https://github.com/microsoft/monaco-editor/issues/5177 */
/* .monaco-editor .monaco-hover {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}
.monaco-component {
  visibility: hidden !important;
} */
</style>