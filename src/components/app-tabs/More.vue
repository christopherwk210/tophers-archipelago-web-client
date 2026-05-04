<script setup lang="ts">
import Settings from '@/components/more-tabs/Settings.vue';
import Help from '@/components/more-tabs/Help.vue';
import { TabManager } from '@/lib/tab-manager';
import type { ComponentTab } from '@/state/tabs';
import Accounts from '../more-tabs/Accounts.vue';
import Changes from '../more-tabs/Changes.vue';
import Theme from '../more-tabs/Theme.vue';
import { useLocalization } from '@/lib/localization-util';
import Credits from '../more-tabs/Credits.vue';

const { t } = useLocalization();

const tabManager = new TabManager([
  {
    label: t('More.moreTabSettings'),
    keypath: 'More.moreTabSettings',
    component: Settings
  },
  {
    label: t('More.moreTabTheme'),
    keypath: 'More.moreTabTheme',
    component: Theme
  },
  {
    label: t('More.moreTabAccounts'),
    keypath: 'More.moreTabAccounts',
    component: Accounts
  },
  {
    label: t('More.moreTabChangelog'),
    keypath: 'More.moreTabChangelog',
    component: Changes
  },
  {
    label: t('More.moreTabHelp'),
    keypath: 'More.moreTabHelp',
    component: Help
  },
  {
    label: t('More.moreTabCredits'),
    keypath: 'More.moreTabCredits',
    component: Credits
  }
] as const satisfies ComponentTab[]);

const Tabs = tabManager.createVueComponent();
</script>

<template>
  <div class="more">
    <Tabs v-slot="{ currentTab }">
      <component :is="currentTab.component" />
    </Tabs>
  </div>
</template>

<style scoped>
.more {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
}

h4 {
  margin: 0;
}

.inner-container {
  flex: 1;
  overflow: auto;
  padding: 0 0.5em;
}
</style>