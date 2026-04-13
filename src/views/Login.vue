<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { client, login } from '@/lib/archipelago';
import { useRoute, useRouter } from 'vue-router';
import { AppStorage } from '@/lib/storage';
import { AppTab, appTabManager } from '@/state/tabs';
import { self } from '@/state/self';
import { localAccounts } from '@/lib/accounts';
import { players } from '@/state/players';
import { loadLocations } from '@/state/tracker';
import LoginThemeSelector from '@/components/LoginThemeSelector.vue';
import { settings } from '@/state/settings';

const router = useRouter();
const route = useRoute();

// Form bindings
const url = ref(AppStorage.get('url') || '');
const slot = ref(AppStorage.get('slot') || '');
const password = ref(AppStorage.get('password') || '');
const showPassword = ref(false);

// Controls the "retry" button appearing during a connection
const connectRetryButtonVisible = ref(false);
const connectRetryTimeout = ref<any>();
const connectRetryTime = 10_000;

// When true, shows the loading window and hides the login form
const connecting = ref(false);

// When not an empty string, display error message on the login window
const error = ref('');

// You can automatically log in by setting the url & slot (& optionally the password) via query parameters:
// https://topheranselmo.com/archipelago/#/?url=archipelago.gg:12345&slot=my_name
// This is primarily used for automatically reconnecting after a page refresh, but could also be used by users to bookmark their login information
if (route.query.url && route.query.slot) {
  url.value = route.query.url as string;
  slot.value = route.query.slot as string;

  if (route.query.password) {
    password.value = route.query.password as string;
  }

  // Attempt immediate connection after parsing query params
  connect();
}

// Attempts to connect to the server
async function connect() {
  // Always open to the chat tab
  appTabManager.currentTabIndex.value = AppTab.CHAT;

  // Hide the retry button and reset it's timeout
  connectRetryButtonVisible.value = false;
  clearTimeout(connectRetryTimeout.value);
  connectRetryTimeout.value = undefined;

  // Ensure error message is empty
  error.value = '';

  // Specifically use undefined instead of an empty string if there's no password to satisfy archipeligo.js
  let passwordValue = password.value.length > 0 ? password.value : undefined;

  // Set our "loading" state to switch the UI
  connecting.value = true;

  // Show the retry button after a timeout
  connectRetryTimeout.value = setTimeout(() => {
    connectRetryButtonVisible.value = true;
  }, connectRetryTime);

  // Attempt the login
  const response = await login(url.value, slot.value, passwordValue);

  players.value = client.players.teams.flat().map((playerSlot, index) => ({
    name: playerSlot.name,
    status: '...',
    slot: playerSlot.slot,
    game: playerSlot.game,
    team: playerSlot.team,
  }));

  // Reset the loading state
  connecting.value = false;

  // Don't need this anymore
  clearTimeout(connectRetryTimeout.value);

  if (!response.success) {
    error.value = response.message || 'Unknown error';
    return;
  }

  if (response.data && (response.data.death_link || response.data.death_link === 1)) {
    client.deathLink.enableDeathLink();
  }

  // Save form fields for future sessions
  AppStorage.set('url', url.value);
  AppStorage.set('slot', slot.value);
  AppStorage.set('password', password.value);

  self.slot = slot.value;

  loadLocations();

  // Go to the main screen
  router.push('/connected');
}

async function retry() {
  await router.push({ name: 'Login', query: { url: url.value, slot: slot.value, password: password.value } });
  window.location.reload();
}

async function cancel() {
  await router.push(`/`);
  window.location.reload();
}

// const hasMultipleAccounts = computed(() => localAccounts.value.length > 1);
const hasMultipleAccounts = computed(() => true);
const switchAccountList = computed(() => localAccounts.value);

const accountSwitcher = ref(-1);
watch(accountSwitcher, () => {
  const selectedAccount = switchAccountList.value[accountSwitcher.value];
  if (selectedAccount) {
    url.value = selectedAccount.url;
    slot.value = selectedAccount.slot;
    password.value = selectedAccount.password || '';
  }
});

function resetAccountSwitcher() {
  accountSwitcher.value = -1;
}

onMounted(() => {
  client.socket.disconnect();
});
</script>

<template>
  <div class="login">
    <h1>Topher's Archipelago Web Client</h1>

    <template v-if="connecting">
      <div class="window">
        <div class="title-bar">
          <div class="title-bar-text">Connecting, please wait...</div>
        </div>
        <div class="window-body">
          <img src="@/assets/images/file_copy.gif">
          <div class="mt-3 progress-indicator segmented">
            <span class="progress-indicator-bar"></span>
          </div>
          <div class="btn-row">
            <button v-if="connectRetryButtonVisible" @click="cancel">Cancel</button>
            <button v-if="connectRetryButtonVisible" @click="retry">Retry</button>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="window">
        <div class="title-bar">
          <div class="title-bar-text">
            Login
          </div>
          <div class="title-bar-controls">
            <select v-model="accountSwitcher" v-if="hasMultipleAccounts" style="width: 160px">
              <option disabled :value="-1">Saved accounts...</option>
              <option v-for="(account, accountIndex) of switchAccountList" :value="accountIndex">{{ account.slot }}</option>
            </select>
          </div>
        </div>
        <div class="window-body">
          <div class="field-row-stacked">
            <label for="url">URL</label>
            <input @input="resetAccountSwitcher" v-model="url" id="url" type="text" placeholder="archipelago.gg:12345" spellcheck="false" autocomplete="off" autocapitalize="none" />
          </div>
          <div class="mt-3 field-row-stacked">
            <label for="name">Name/Slot</label>
            <input @input="resetAccountSwitcher" v-model="slot" id="name" type="text" spellcheck="false" autocomplete="off" autocapitalize="none" />
          </div>
          <div class="mt-3 field-row-stacked">
            <label for="password">Password</label>
            <input @input="resetAccountSwitcher" placeholder="Leave blank if no password is needed" v-model="password" id="password" :type="showPassword ? 'text' : 'password'" spellcheck="false" autocomplete="off" autocapitalize="none" />
          </div>
          <div class="mt-1 field-row-stacked">
            <!-- show password checkbox -->
            <input v-model="showPassword" type="checkbox" id="show-password">
            <label for="show-password">Show Password</label>
          </div>
  
          <div class="btn-row">
            <button @click="connect">Connect</button>
          </div>

          <template v-if="error">
            <strong style="color: red">Error:</strong>
            <div class="field-border-disabled" style="padding: 8px">
              {{ error }}
            </div>
            <div class="tip">
              Tip: If you're trying to connect to a self-hosted archipelago server, you may need to access this client from an insecure http connection.
              <a href="http://insecure.topheranselmo.com/archipelago">Click here</a> to access the insecure version.
            </div>
          </template>
        </div>
  
        <div class="status-bar">
          <p class="status-bar-field">Powered by <a href="https://archipelago.gg/">Archipelago</a></p>
          <p class="status-bar-field">Made by <a href="https://topheranselmo.com/">topher</a></p>
          <p class="status-bar-field"><a href="https://github.com/christopherwk210/tophers-archipelago-web-client">Source code</a></p>
        </div>
      </div>
    </template>

    <LoginThemeSelector v-if="settings.showLoginThemeButton && !connecting" />
  </div>
</template>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  background: #008080;
  position: relative;
  padding: 1em;
}

h1 {
  color: white;
  position: absolute;
  top: 1rem;
  left: 1rem;
  margin: 0;
  font-size: 2.5rem;
  font-style: italic;
  font-family: serif !important;
  text-shadow: 4px 4px 0 black;
  user-select: none;

  max-width: 550px;
  margin-right: 100px;
}

.window {
  max-width: 400px;
  width: 100%;
  position: relative;
  z-index: 100;
}

.btn-row {
  margin: 1em 0;
  display: flex;
  justify-content: flex-end;
  margin-right: 1em;
}

.btn-row button {
  padding: 0.5em 1em;
}

.status-bar {
  font-size: 12px;
}

img {
  user-select: none;
  -webkit-user-drag: none;
  display: block;
  margin: 0 auto;
}

.progress-indicator-bar {
  animation: load 7s linear infinite;
}

@keyframes load {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}

.tip {
  font-size: 0.9em;
  font-style: italic;
  margin-top: 0.5rem;
}
</style>