<script setup lang="ts">
import { useLocalization } from '@/lib/localization-util';
import { changelogHTML, parseChangelog } from '@/state/changelog';
import { onActivated, onMounted } from 'vue';

const { t } = useLocalization();
</script>

<template>
  <div class="inner-container changelog">
    <div style="margin-bottom: 0.5em">
      <a target="_blank" href="https://github.com/christopherwk210/tophers-archipelago-web-client/blob/main/CHANGELOG.md"><button>{{ t('MiscUI.viewGithub') }}</button></a>
    </div>
    <div class="sunken-panel" v-html="changelogHTML"></div>
  </div>
</template>

<style scoped>
.changelog {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.inner-container {
  padding: 0 !important;
}

.sunken-panel {
  padding: 1em;
  flex: 1;
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