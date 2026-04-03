<script setup lang="ts">
import { ui } from '@/state/ui';
import { useElementSize, useMouse } from '@vueuse/core';
import { computed, useTemplateRef } from 'vue';

const mouse = useMouse();

const mouseToastMargin = 5;
const mouseToast = useTemplateRef('mouse-toast');
const mouseToastSize = useElementSize(mouseToast, undefined, { box: 'border-box' });

const mouseToastStyle = computed(() => {
  let targetTop = Math.round(mouse.y.value - mouseToastSize.height.value - mouseToastMargin);
  let targetLeft = Math.round(mouse.x.value + mouseToastMargin);

  if (targetTop < 0) targetTop = 0;
  if (targetLeft < 0) targetLeft = 0;

  if (targetLeft + mouseToastSize.width.value > window.innerWidth) {
    targetLeft = window.innerWidth - mouseToastSize.width.value;
  }

  return {
    top: targetTop + 'px',
    left: targetLeft + 'px'
  };
});
</script>

<template>
  <Transition>
    <div :key="ui.mouseToast.id" v-if="ui.mouseToast.visible" ref="mouse-toast" class="mouse-toast" :style="mouseToastStyle" v-html="ui.mouseToast.content"></div>
  </Transition>
</template>

<style scoped>
.mouse-toast {
  position: absolute;
  background: rgba(0, 100, 0, 0.9);
  color: white;
  padding: 0.5em 1em;
  border-radius: 4px;
  pointer-events: none;
  z-index: 99999;
  font-size: 1rem;
  user-select: none;
  will-change: top, left;
}

.v-enter-active, .v-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform-origin: bottom left !important;
}

.v-enter-from, .v-leave-to {
  opacity: 0;
  transform: rotate(15deg);
}
</style>