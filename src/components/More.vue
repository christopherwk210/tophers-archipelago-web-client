<script setup lang="ts">
import { sounds } from '@/audio';
import { settings } from '@/state';
import { computed, ref } from 'vue';

const tabs = ref([
  'Settings',
  'Help'
]);
const selectedTabIndex = ref(0);
const selectedTab = computed<string>(() => tabs.value[selectedTabIndex.value]!);
</script>

<template>
  <div class="help">
    <menu role="tablist">
      <li role="tab" v-for="(tab, index) of tabs" :aria-selected="selectedTabIndex === index">
        <a @click="selectedTabIndex = index">
          {{ tab }}
        </a>
      </li>
    </menu>
    <div class="window" role="tabpanel" style="overflow: hidden; flex: 1; display: flex; flex-direction: column;">
      <div class="window-body" v-show="selectedTab === 'Help'">
        <div class="inner-container">
          <fieldset>
            <legend><strong>Chat</strong></legend>
            
            <p class="mt-0">
              The Chat tab contains all of the messages that have been sent and received since you've logged in. To send a message
              or use commands, type in the box at the bottom of the screen and then press Enter.
            </p>
        
            <p>
              When sending messages, this client supports a few rich text features:
            </p>
            <ul>
              <li><em>*Italics*</em></li>
              <li><strong>**Bold**</strong></li>
              <li><a href="#" @click.prevent="">http://automatic-links</a></li>
            </ul>
        
            <p>
              If you want to resend the message you just sent, press the Up Arrow key while the input box is focused. This will recall your last message, allowing you to edit it before sending again.
            </p>
        
            <p class="mb-0">
              You can clear the entire chat log by sending <strong>/clear</strong>.
            </p>
          </fieldset>
        
          <fieldset class="mt-3">
            <legend><strong>Hints</strong></legend>
            
            <p class="mt-0">
              Once there has been a generated hint related to you, it will appear in the Hints tab.
            </p>
  
            <p class="mb-0">
              To buy hints, you can use the <strong>"Buy item hint"</strong> button or use the <strong>!hint</strong> command.
            </p>
          </fieldset>
  
          <fieldset class="mt-3">
            <legend><strong>Players</strong></legend>
            
            <p class="mt-0 mb-0">
              The Players tab will show a table of all registered players, the game they are playing, and their current status.
            </p>
          </fieldset>
  
          <fieldset class="mt-3">
            <legend><strong>Tracker</strong></legend>
            
            <p class="mt-0 mb-0">
              The Tracker tab shows you all collected items, and all locations and whether they are checked or not.
            </p>
          </fieldset>
  
          <fieldset class="mt-3">
            <legend><strong>General</strong></legend>
            
            <p class="mt-0 ">
              All tables can be sorted by clicking on the column headers.
            </p>
  
            <p class="mb-0">
              Other than the Chat tab, each section only updates when you switch to it. To refresh any list, simply go to another tab and then back to the desired tab.
            </p>
          </fieldset>
        </div>
      </div>

      <div class="window-body" v-show="selectedTab === 'Settings'">
        <div class="inner-container">
          <fieldset>
            <legend><strong>Notifications</strong></legend>
            <div class="field-row" style="max-width: 300px; margin-bottom: 1em;">
              <label for="volume">Volume:</label>
              <label for="volume">Low</label>
              <input v-model.number="settings.notificationsVolume" id="volume" type="range" min="0" max="1" value="0.5" step="0.1" />
              <label for="volume">High</label>
            </div>
  
            <div class="check-row">
              <button @click="() => sounds.notify.play()" class="audio-play-btn"><img src="@/assets/icons/speaker.png"></button>
              <div>
                <input v-model="settings.notificationsItemSent" type="checkbox" id="itemSentNotification">
                <label for="itemSentNotification">Play a sound when someone has sent you an item</label>
              </div>
            </div>
  
            <div class="check-row">
              <button @click="() => sounds.chimes.play()" class="audio-play-btn"><img src="@/assets/icons/speaker.png"></button>
              <div>
                <input v-model="settings.notificationsPlayerConnected" type="checkbox" id="connectNotification">
                <label for="connectNotification">Play a sound when someone connects</label>
              </div>
            </div>
          </fieldset>
          
          <fieldset class="mt-3">
            <legend><strong>General</strong></legend>
            
            <div class="check-row">
              <input v-model="settings.generalAutoReconnect" type="checkbox" id="attemptReconnect">
              <label for="attemptReconnect">Attempt to reconnect automatically on page refresh</label>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.check-row {
  margin-bottom: 0.5em;
  display: flex;
  align-items: center;
}

.help {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
}

h4 {
  margin: 0;
}

menu {
  padding-top: 0.25em;
}

menu a {
  user-select: none;
  cursor: pointer;
  padding: 0 0.5em;
}

.window-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.inner-container {
  flex: 1;
  overflow: auto;
  padding: 0 0.5em;
}

.audio-play-btn {
  width: 2em;
  height: 2em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 0.25em;
  min-height: initial !important;
  min-width: initial !important;
  margin-right: 0.5em;
}

.audio-play-btn img {
  align-self: center;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>