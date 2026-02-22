<script setup lang="ts">
import { client, messages } from '@/archipelago';
import { nextTick, ref, useTemplateRef, watch } from 'vue';

const say = ref('');

const sayInput = useTemplateRef('sayInput');
const messagesElement = useTemplateRef('messagesElement');

const sending = ref(false);
const nextSay = ref('');

async function sendMessage() {
  if (sending.value || say.value.trim().length === 0) return;

  nextSay.value = say.value;
  say.value = '';

  sending.value = true;
  await client.messages.say(nextSay.value);
  sending.value = false;

  if (sayInput.value) {
    sayInput.value.focus();
  }
}

watch([sending, messages], async () => {
  if (messagesElement.value) {
    // If we are already scrolled to the bottom
    if (isUserAtBottom(messagesElement.value)) {
      await nextTick();

      // Scroll to the bottom of the messages element
      messagesElement.value.scrollTop = messagesElement.value.scrollHeight;
    }
  }
});

function isUserAtBottom(container: HTMLElement) {
  // A small threshold can prevent issues with margins/borders
  const threshold = 50; 
  return container.scrollHeight - container.scrollTop <= container.offsetHeight + threshold;
}
</script>

<template>
  <div ref="messagesElement" class="messages">
    <div class="message" v-for="message of messages" v-html="message"></div>
    <div style="opacity: 0.75; font-style: italic;" v-if="sending">Sending: {{ nextSay }}</div>
  </div>
  <div class="input">
    <input ref="sayInput" :disabled="sending" @keydown.enter="sendMessage" placeholder="Type here..." v-model="say" id="say" type="text" spellcheck="false" autocomplete="off" autocapitalize="none" />
  </div>
</template>

<style scoped>
.messages {
  flex: 1;
  overflow: auto;
  height: 100%;
  margin-bottom: 0.5em;
  padding-right: 0.5em;
}

input {
  width: 100%;
}

.message {
  margin-bottom: 0.5em;
  white-space: pre-wrap;
}
</style>

<style>
.inline-img {
  height: 1em;
  align-self: center;
  margin-right: 0.25em;
}
</style>