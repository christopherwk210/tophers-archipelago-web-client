<script setup lang="ts">
import { useLocalization } from '@/lib/localization-util';
import { contributorsHTML, creditsHTML } from '@/state/markdown';

const { t } = useLocalization();
</script>

<template>
  <div class="inner-container credits">
    <div style="margin-bottom: 0.5em">
      <a target="_blank" href="https://github.com/christopherwk210/tophers-archipelago-web-client/blob/main/CONTRIBUTORS.md"><button>{{ t('MiscUI.viewGithub') }}</button></a>
    </div>
    <div class="sunken-panel contributors-panel" v-html="contributorsHTML"></div>
    <div class="sunken-panel" v-html="creditsHTML"></div>
  </div>
</template>

<style scoped>
.credits {
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

.contributors-panel {
  line-height: 1.5;
}
</style>

<style>
.credits h1 {
  font-size: 1.15em;
  text-decoration: underline;
}

.credits .sunken-panel > *:first-child {
  margin-top: 0;
}

.credits h2 {
  font-size: 1.1em;
}

.credits ul {
  /* list-style: none; */
  padding-left: 1em;
}
</style>