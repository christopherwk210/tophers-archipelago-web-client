<script setup lang="ts">
import { client, messages } from '@/archipelago';
import type { SayPacket } from 'archipelago.js';
import { nextTick, ref, useTemplateRef, watch } from 'vue';

const say = ref('');

const sayInput = useTemplateRef('sayInput');
const messagesElement = useTemplateRef('messagesElement');

const sending = ref(false);
const nextSay = ref('');

const lastSent = ref('');

async function sendMessage() {
  if (sending.value || say.value.trim().length === 0) return;

  if (say.value === '/clear') {
    messages.value = [];
    say.value = '';
    return;
  }

  nextSay.value = say.value.trim();
  say.value = '';

  sending.value = true;

  if (nextSay.value.startsWith('!admin')) {
    const request: SayPacket = { cmd: 'Say', text: nextSay.value };
    client.socket.send(request);
  } else {
    await client.messages.say(nextSay.value).catch(() => {})
  }

  sending.value = false;

  lastSent.value = nextSay.value;

  if (sayInput.value) {
    sayInput.value.focus();
  }
}

watch(
  () => messages.value.length,
  async () => {
    const el = messagesElement.value;
    if (!el) return;

    const atBottom = isUserAtBottom(el);

    if (atBottom) {
      await nextTick();
      el.scrollTop = el.scrollHeight;
    }
  }
);

function isUserAtBottom(container: HTMLElement) {
  
  // A small threshold can prevent issues with margins/borders
  const threshold = 50; 
  return container.scrollHeight - container.scrollTop <= container.offsetHeight + threshold;
}

async function recall(event: Event) {
  if (say.value.trim().length === 0 && lastSent.value.trim().length > 0) {
    say.value = lastSent.value;
    await new Promise(resolve => setTimeout(resolve, 10)); // Wait for DOM update
    const target = event.target as HTMLInputElement;
    if (target) {
      target.selectionStart = target.selectionEnd = target.value.length;
    }
  }
}
</script>

<template>
  <div ref="messagesElement" class="messages">
    <div class="message" v-for="message of messages" v-html="message"></div>
    <div style="opacity: 0.75; font-style: italic;" v-if="sending">Sending: {{ nextSay }}</div>
  </div>
  <div class="input">
    <input
      ref="sayInput"
      @keydown.enter="sendMessage"
      @keydown.arrow-up="recall"
      placeholder="Type here..."
      v-model="say"
      id="say"
      type="text"
      spellcheck="false"
      autocomplete="off"
      autocapitalize="none"
    />
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