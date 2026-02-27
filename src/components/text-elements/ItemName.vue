<script setup lang="ts">
import { itemClassToString, type ItemClass } from '@/lib/archipelago';
import { getItemStyles } from '@/lib/theme';
import { settings } from '@/state/settings';
import tippy, { type Instance } from 'tippy.js';
import { onActivated, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';

const element = useTemplateRef('element');
const tippyInstance = ref<Instance>();

const props = defineProps<{
  name: string;
  iclass: ItemClass;
}>();

function createTippy() {
  if (tippyInstance.value) tippyInstance.value.destroy();
  tippyInstance.value = undefined;

  if (element.value && settings.value.generalShowItemTooltips) {
    tippyInstance.value = tippy(element.value, {
      content: itemClassToString(props.iclass),
      theme: 'light',
      arrow: true,
      duration: 100
    });
  }
}

onActivated(() => createTippy());
onMounted(() => createTippy());

onBeforeUnmount(() => {
  if (tippyInstance.value) tippyInstance.value.destroy();
});

watch(() => props.iclass, () => {
  if (tippyInstance.value) tippyInstance.value.setContent(itemClassToString(props.iclass));
});
</script>

<template>
  <em ref="element" :style="getItemStyles(props.iclass)">{{ props.name }}</em>
</template>