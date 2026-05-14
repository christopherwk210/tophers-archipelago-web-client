<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { cursorSvgId } from './cursor-assets';

const props = withDefaults(defineProps<{
  image: any;
  label?: string;
  color?: string;
  x?: number;
  y?: number;
  offset?: { x: number; y: number };
}>(), {
  x: 0,
  y: 0,
  color: '#ffffff',
  offset: () => ({ x: 0, y: 0 })
});

// Very slightly darker color
const secondaryColor = computed(() => {
  const hex = props.color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)})`;
});

const svgHtml = ref('');

watch(() => props.image, () => {
  const svgString = props.image;

  const idRegex = /id="([^"]+)"/g;
  const ids = new Set<string>();
  let match;
  while ((match = idRegex.exec(svgString)) !== null) {
    if (match[1]) ids.add(match[1]);
  }

  let modifiedSvgString = svgString;

  ids.forEach(id => {
    modifiedSvgString = modifiedSvgString.split(id).join(`cursor-${cursorSvgId.value++}`);
  });

  svgHtml.value = modifiedSvgString;
}, { immediate: true });
</script>

<template>
  <div data-tawcs-cursor :style="{
    transform: `translate(${props.x}px, ${props.y}px)`,
    '--tawc-cursor-primary-fill': props.color,
    '--tawc-cursor-secondary-fill': secondaryColor
  }">
    <div data-tawcs-cursor-image v-html="svgHtml" :style="{ transform: `translate(${props.offset.x}px, ${props.offset.y}px)` }"></div>
    <div v-if="props.label" data-tawcs-cursor-name :style="{
      transform: `translate(${props.offset.x}px, ${props.offset.y}px)`
    }">{{ props.label }}</div>
  </div>
</template>

<style scoped>
[data-tawcs-cursor] {
  position: fixed;
  z-index: 999;
  font-size: 12px;
  font-family: monospace;
  display: flex;
  flex-direction: column;
  user-select: none;
  pointer-events: none;
  opacity: var(--tawc-cursor-opacity);
  text-shadow: 0 0 2px var(--tawc-cursor-primary-fill);
  left: 0;
  top: 0;
  will-change: transform;
}

[data-tawcs-cursor-image] {
  position: relative;
  width: 32px;
  height: 32px;
}

[data-tawcs-cursor-name] {
  padding-left: 1em;
}
</style>