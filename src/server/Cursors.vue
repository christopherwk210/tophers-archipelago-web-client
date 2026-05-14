<script setup lang="ts">
import { computed } from 'vue';
import type { CursorManager, ICursor } from './cursor-manager';
import { cursorAssets, type CursorAsset } from './cursor-assets';
import Cursor from './Cursor.vue';

const props = defineProps<{
  cursorManager?: CursorManager;
}>();

const cursors = computed(() => {
  if (!props.cursorManager) return [];
  return [...props.cursorManager.cursors.values()];
});

function asset(cursor: ICursor): CursorAsset | undefined {
  return (cursorAssets as any)?.[cursor.meta.image];
}

const assetCursors = computed<{ cursor: ICursor; asset: CursorAsset }[]>(() => {
  return cursors.value
    .map(cursor => ({ cursor, asset: asset(cursor)! }))
    .filter(({ asset }) => !!asset);
});
</script>

<template>
  <Teleport to="body">
    <template v-for="{ asset, cursor } of assetCursors">
      <Cursor
        :image="asset.asset_raw"
        :x="cursor.x"
        :y="cursor.y"
        :color="cursor.meta.color ?? '#ffffff'"
        :label="cursor.slot"
        :offset="asset.offset"
      />
    </template>

    <!-- Uncomment to test cursor asset offsets -->
    <!-- <div class="cursor-testing">
      <div class="cursor-preview" v-for="asset of Object.values(cursorAssets)">
        <img :src="asset.image" :style="{ transform: `translate(${asset.offset.x}px, ${asset.offset.y}px)` }">
      </div>
    </div> -->
  </Teleport>
</template>

<style scoped>
.cursor-testing {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: black;
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  padding: 1em;
}

.cursor-preview {
  border: 1px solid red;
  width: 32px;
  height: 32px;
  display: flex;
}
</style>