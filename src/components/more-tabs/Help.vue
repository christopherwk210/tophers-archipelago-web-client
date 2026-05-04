<script setup lang="ts">
import { useLocalization } from '@/lib/localization-util';

const { t } = useLocalization();
</script>

<template>
  <div class="inner-container">
    <fieldset>
      <legend><img class="legend-icon" src="@/assets/icons/warning-fill.png"> <strong>{{ t('Help.helpTroubleshooting') }}</strong></legend>
      
      <p class="mt-0" v-html="t('Help.helpTroubleshootingSteps')"></p>

      <ol style="line-height: 1.5" class="mb-0">
        <li v-html="t('Help.helpTroubleshootingStep0')"></li>
        <li v-html="t('Help.helpTroubleshootingStep1')"></li>
        <li v-html="t('Help.helpTroubleshootingStep2')"></li>
      </ol>

      <!-- <p class="mb-0">
        Other than the Chat tab, each section only updates when you switch to it. To refresh any list, simply go to another tab and then back to the desired tab.
      </p> -->
    </fieldset>

    <fieldset class="mt-3">
      <legend><img class="legend-icon" src="@/assets/icons/info.png"> <strong>{{ t('Help.helpGeneral') }}</strong></legend>

      <p class="mt-0" v-html="t('Help.helpGeneralUpdating')"></p>

      <p class="mb-0" v-html="t('Help.helpGeneralTables')"></p>
    </fieldset>

    <fieldset class="mt-3">
      <legend><img class="legend-icon" src="@/assets/icons/info.png"> <strong>{{ t('Help.helpChat') }}</strong></legend>

      <p class="mt-0" v-html="t('Help.helpChatSendMessage')"></p>

      <p class="mb-0" v-html="t('Help.helpChatRichText')"></p>
      <ul>
        <li><em>*<span v-html="t('Help.helpChatItalics')"></span>*</em></li>
        <li><strong>**<span v-html="t('Help.helpChatBold')"></span>**</strong></li>
        <li><a href="#" @click.prevent="">{{ t('Help.helpChatLinks') }}</a></li>
      </ul>
  
      <p v-html="t('Help.helpChatRecall')"></p>

      <p class="mb-0" v-html="t('Help.helpChatClear')"></p>
    </fieldset>
  
    <fieldset class="mt-3">
      <legend><img class="legend-icon" src="@/assets/icons/info.png"> <strong>{{ t('Help.helpHints') }}</strong></legend>

      <p class="mt-0" v-html="t('Help.helpHintsAppear')"></p>

      <p v-html="t('Help.helpHintsBuy')"></p>

      <p v-html="t('Help.helpHintsCopy')"></p>

      <p class="mb-0" v-html="t('Help.helpHintsToggleHidden')"></p>
    </fieldset>

    <fieldset class="mt-3">
      <legend><img class="legend-icon" src="@/assets/icons/info.png"> <strong>{{ t('Help.helpPlayers') }}</strong></legend>

      <p class="mt-0" v-html="t('Help.helpPlayersTab')"></p>

      <p class="mb-0">
        <span v-html="t('Help.helpPlayersProgress')"></span>
        <br>
        <small>
          <span v-html="t('Help.helpPlayersStatusNote')"></span>
        </small>
      </p>
    </fieldset>

    <fieldset class="mt-3">
      <legend><img class="legend-icon" src="@/assets/icons/info.png"> <strong v-html="t('Help.helpTracker')"></strong></legend>

      <p class="mt-0" v-html="t('Help.helpTrackerTab')"></p>

      <p class="mb-0" v-html="t('Help.helpTrackerBuy')"></p>
    </fieldset>

    <fieldset class="mt-3">
      <legend><img class="legend-icon" src="@/assets/icons/info.png"> <strong v-html="t('Help.helpAccounts')"></strong></legend>

      <p class="mt-0" v-html="t('Help.helpAccountsTab')"></p>

      <p class="mb-0" v-html="t('Help.helpAccountsDropdown')"></p>
    </fieldset>
  </div>
</template>

<style scoped>
p {
  line-height: 1.5;
}

legend {
  display: flex;
  gap: 0.3em;
}

.legend-icon {
  height: 1em;
  align-self: center;
}
</style>