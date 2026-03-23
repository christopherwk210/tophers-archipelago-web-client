<script setup lang="ts">
import { getPlayerStyles } from '@/lib/theme';
import { settings } from '@/state/settings';
import tippy, { type Instance } from 'tippy.js';
import { onActivated, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';

const element = useTemplateRef('element');
const tippyInstance = ref<Instance>();

const props = defineProps<{
  alias: string;
  slot: number;
  game: string;
}>();

function createTippy() {
  if (tippyInstance.value) tippyInstance.value.destroy();
  tippyInstance.value = undefined;

  if (element.value && settings.value.generalShowPlayerTooltips) {
    tippyInstance.value = tippy(element.value, {
      content: props.game,
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

watch(() => props.game, () => {
  if (tippyInstance.value) tippyInstance.value.setContent(props.game);
});
</script>

<template>
  <strong class="player-name" ref="element" :style="getPlayerStyles(props.slot)">{{ props.alias }}</strong>
</template>