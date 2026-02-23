<script setup lang="ts">
import { ref } from 'vue';
import { login, messages } from '@/archipelago';
import { useRoute, useRouter } from 'vue-router';
import { state as appState, appTabs } from '@/state';

const router = useRouter();
const route = useRoute();

const localStorageKey = 'tawc';

const url = ref(localStorage.getItem(`${localStorageKey}:url`) || '');
const slot = ref(localStorage.getItem(`${localStorageKey}:slot`) || '');
const password = ref(localStorage.getItem(`${localStorageKey}:password`) || '');

const connectRetryButtonVisible = ref(false);
const connectRetryTimeout = ref<any>();

const state = ref<'idle' | 'connecting'>('idle');
const error = ref('');

if (route.query.url && route.query.slot) {
  url.value = route.query.url as string;
  slot.value = route.query.slot as string;

  if (route.query.password) {
    password.value = route.query.password as string;
  }

  connect();
}

async function connect() {
  appTabs.value.selectedTabIndex = 0;

  connectRetryButtonVisible.value = false;
  clearTimeout(connectRetryTimeout.value);
  connectRetryTimeout.value = undefined;

  error.value = '';

  let passwordValue = password.value.length > 0 ? password.value : undefined;

  state.value = 'connecting';

  connectRetryTimeout.value = setTimeout(() => {
    connectRetryButtonVisible.value = true;
  }, 10_000);

  const response = await login(url.value, slot.value, passwordValue);
  state.value = 'idle';

  if (response.success) {
    localStorage.setItem(`${localStorageKey}:url`, url.value);
    localStorage.setItem(`${localStorageKey}:slot`, slot.value);
    localStorage.setItem(`${localStorageKey}:password`, password.value);

    appState.value.mySlot = slot.value;

    router.push('/connected');
  } else {
    error.value = response.message || 'Unknown error';
  }
}

async function retry() {
  const queryParams = new URLSearchParams();
  queryParams.set('url', url.value);
  queryParams.set('slot', slot.value);
  if (password.value) {
    queryParams.set('password', password.value);
  }

  await router.push(`/?${queryParams.toString()}`);
  window.location.reload();
}

async function cancel() {
  await router.push(`/`);
  window.location.reload();
}
</script>

<template>
  <div class="login">
    <h1>Topher's Archipelago Web Client</h1>

    <template v-if="state === 'connecting'">
      <div class="window">
        <div class="title-bar">
          <div class="title-bar-text">Connecting, please wait...</div>
        </div>
        <div class="window-body">
          <img src="@/assets/file_copy.gif">
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

    <template v-else-if="state === 'idle'">
      <div class="window">
        <div class="title-bar">
          <div class="title-bar-text">Login</div>
        </div>
        <div class="window-body">
          <div class="field-row-stacked">
            <label for="url">URL</label>
            <input v-model="url" id="url" type="text" placeholder="archipelago.gg:12345" spellcheck="false" autocomplete="off" autocapitalize="none" />
          </div>
          <div class="mt-3 field-row-stacked">
            <label for="name">Name/Slot</label>
            <input v-model="slot" id="name" type="text" spellcheck="false" autocomplete="off" autocapitalize="none" />
          </div>
          <div class="mt-3 field-row-stacked">
            <label for="password">Password</label>
            <input placeholder="Leave blank if no password is needed" v-model="password" id="password" type="password" spellcheck="false" autocomplete="off" autocapitalize="none" />
          </div>
  
          <div class="btn-row">
            <button @click="connect">Connect</button>
          </div>

          <template v-if="error">
            <strong style="color: red">Error:</strong>
            <div class="field-border-disabled" style="padding: 8px">
              {{ error }}
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
</style>