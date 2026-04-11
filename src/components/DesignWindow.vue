<script setup lang="ts">
import { ui } from '@/state/ui';
import { useDraggable, useEventListener } from '@vueuse/core';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import * as monaco from 'monaco-editor';
import { customCSS, setCustomCSS } from '@/lib/theme';
import { saveAs } from 'file-saver';

import sampleTheme from '@/assets/sample-theme.css?raw';

const title = useTemplateRef('title');
const bottomRightDrag = useTemplateRef('bottom-right-drag');
const editorOutlet = useTemplateRef('editor-outlet');

let editor: monaco.editor.IStandaloneCodeEditor;
const temporaryEditorContents = ref('');

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

watch(() => ui.design.windowOpen, () => {
  if (ui.design.windowOpen) {
    temporaryEditorContents.value = customCSS.value;
    editor.focus();
    editor.setValue(temporaryEditorContents.value);
  }
})

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

onMounted(() => {
  if (!editorOutlet.value) return;

  editor = monaco.editor.create(editorOutlet.value, {
    value: '',
    language: 'css',
    automaticLayout: true,
    theme: 'vs-dark',
    tabSize: 2,
    contextmenu: true
  });

  editor.onDidChangeModelContent((e) => {
    const editorContents = editor.getValue();
    const customStyleTag = document.querySelector('style[data-tawc-custom-theme]');
    if (customStyleTag) {
      temporaryEditorContents.value = editorContents;
      customStyleTag.textContent = editorContents;
    }
  });

  const removableIds = [
    'editor.action.peekDefinition',
    'editor.action.referenceSearch.trigger',
    'editor.action.revealDefinition',
    'editor.action.goToReferences',
    'editor.action.quickOutline',
    'submenuitem.EditorContextPeek'
  ];
  const contextmenu: any = editor.getContribution('editor.contrib.contextmenu');
  const realMethod = contextmenu._getMenuActions;
  contextmenu._getMenuActions = function() {
    const items = realMethod.apply(contextmenu, arguments);
    return items.filter((item: any) => {
      return !removableIds.includes(item.id);
    });
  };
});

function close() {
  ui.design.windowOpen = false;
  customCSS.value = temporaryEditorContents.value;
  setCustomCSS(customCSS.value);
}

function reset() {
  const areYouSure = confirm('Are you sure you want to reset your custom theme? This action cannot be undone.');
  if (areYouSure) {
    temporaryEditorContents.value = '';
    editor.focus();
    editor.setValue(temporaryEditorContents.value);
  }
}

function download() {
  saveAs(new Blob([temporaryEditorContents.value], { type: 'text/css' }), 'tawc-custom-theme.css');
}

function loadSample() {
  const areYouSure = confirm('This will overwrite your current CSS with the sample theme. Continue?');
  if (!areYouSure) return;

  temporaryEditorContents.value = sampleTheme;
  editor.focus();
  editor.setValue(temporaryEditorContents.value);
}
</script>

<template>
  <Teleport to="body">
    <div ref="container" :style="windowStyle" data-design-window>
      <div ref="title" data-design-window-title>
        <span style="padding-left: 0.5em">Design Window - Custom CSS</span>
        <div @click="close" data-design-window-close>✖</div>
      </div>
      <div data-design-window-body>
        <div data-design-window-toolbar>
          <div @click="download" data-design-window-toolbar-btn>Download</div>
          <div @click="loadSample" data-design-window-toolbar-btn>Load sample</div>
          <div @click="reset" data-design-window-toolbar-btn>Reset</div>
        </div>
        <div ref="editor-outlet" data-design-window-editor-outlet></div>
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
  z-index: 100000;
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
</style>