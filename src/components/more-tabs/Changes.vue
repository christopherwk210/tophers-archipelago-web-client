<script setup lang="ts">
import { changelogHTML } from '@/state/changelog';
</script>

<template>
  <div class="inner-container changelog">
    <div class="sunken-panel" v-html="changelogHTML"></div>
  </div>
</template>

<style scoped>
.inner-container {
  padding: 0 !important;
}

.sunken-panel {
  padding: 1em;
  height: 100%;
}
</style>

<style>
.changelog h1 {
  font-size: 1.15em;
  text-decoration: underline;
}

.changelog .sunken-panel > *:first-child {
  margin-top: 0;
}

.changelog h2 {
  font-size: 1.1em;
}

.changelog ul {
  list-style: none;
  padding-left: 1em;
}
</style>