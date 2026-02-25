<script setup lang="ts">
import { isUserAtBottom } from '@/lib/dom-utils';
import { chat, sendMessage } from '@/state/chat';
import { nextTick, onActivated, ref, useTemplateRef, watch } from 'vue';

// Icons
import question from '@/assets/icons/question.png';
import info from '@/assets/icons/info.png';
import user from '@/assets/icons/user.png';
import check from '@/assets/icons/check.png';
import warning from '@/assets/icons/warning.png';
import warningFill from '@/assets/icons/warning-fill.png';
import world from '@/assets/icons/world.png';

const sayInput = useTemplateRef('sayInput');
const messagesElement = useTemplateRef('messagesElement');

const lastScrollPosition = ref(0);

// Triggered by keyboard enter in the input box
async function send() {
  // Don't send empty messages
  if (chat.say.trim().length === 0) return;

  // Scroll to the bottom
  if (messagesElement.value) messagesElement.value.scrollTop = messagesElement.value.scrollHeight;

  // Fire away
  sendMessage();
}

// Keep the user scrolled to the bottom when new messages come in
watch(() => chat.messages.length, async () => {
  const el = messagesElement.value;
  if (!el) return;

  if (isUserAtBottom(el)) {
    await nextTick();
    el.scrollTop = el.scrollHeight;
  }
});

// Recall the last sent message into the say box
async function recall() {
  if (chat.say.trim().length === 0 && chat.lastSay.trim().length > 0) {
    chat.say = chat.lastSay;
    
    await nextTick();

    if (sayInput.value) {
      const len = chat.lastSay.length;
      sayInput.value.setSelectionRange(len, len);
    }
  }
}

// Used for retaining the scroll position after navigating away
function onScroll() {
  const el = messagesElement.value;
  if (!el) return;

  lastScrollPosition.value = el.scrollTop;
}

onActivated(() => {
  if (messagesElement.value) {
    messagesElement.value.scrollTop = lastScrollPosition.value;
  }

  if (sayInput.value) sayInput.value.focus();
});
</script>

<template>
  <div ref="messagesElement" class="messages" @scroll="onScroll">
    <template v-for="message of chat.messages">
      <!-- Unclassified messages -->
      <div v-if="message.type === 'none'" class="message" v-html="message.content"></div>

      <!-- Player chat messages -->
      <div v-else-if="message.type === 'player-chat'" class="message">
        <!-- This icon is invisible just to keep the message aligned with other messages that do have icons -->
        <img class="inline-img" style="opacity: 0; pointer-events: none;" :src="info">
        <strong>{{ message.player }}</strong>: <span v-html="message.content"></span>
      </div>

      <!-- User command message -->
      <div v-else-if="message.type === 'user-command'" class="message">
        <pre style="background: #c0c0c0">{{ message.content }}</pre>
      </div>

      <!-- Tutorial message -->
      <div v-else-if="message.type === 'tutorial'" class="message">
        <img class="inline-img" :src="info"><em style="color: teal;">{{ message.content }}</em>
      </div>

      <!-- Item sent -->
      <div v-else-if="message.type === 'item-sent'" class="message" :class="{ 'item-for-me': message.isForMe }">
        <img class="inline-img" :src="message.isForMe ? warningFill : warning">
        <strong>{{ message.sender }}</strong>

        <template v-if="message.isGift">
          sent <em style="color: blue;">{{ message.itemName }}</em> (<span style="color: #8b008b;">{{ message.itemLocationName }}</span>) to <strong>{{ message.receiver }}</strong>
        </template>

        <template v-else>
          found their item <em style="color: blue;">{{ message.itemName }}</em> (<span style="color: #8b008b;">{{ message.itemLocationName }}</span>)
        </template>
      </div>

      <!-- Item hinted -->
      <div v-else-if="message.type === 'item-hinted'" class="message">
        <img class="inline-img" :src="message.found ? check : question">
        <strong>{{ message.receiver }}</strong>'s <em style="color: blue;">{{ message.itemName }}</em> is at <em style="color: #8b008b;">{{ message.itemLocation }}</em> in <strong>{{ message.sender }}</strong>'s world.
        <span v-if="message.found" style="color: green;">(found)</span>
      </div>

      <!-- Goaled -->
      <div v-else-if="message.type === 'goaled'" class="message">
        <img class="inline-img" :src="world">
        <strong>{{ message.player }}</strong> (Team {{ message.team }}) has completed their goal!
      </div>

      <!-- Connected -->
      <div v-else-if="message.type === 'connected'" class="message">
        <img class="inline-img" :src="user">
        <span style="color: #006400"><strong>{{ message.player }}</strong> has joined! ({{ message.game }} - Team {{ message.team }})</span>
      </div>

      <!-- Disconnected -->
      <div v-else-if="message.type === 'disconnected'" class="message">
        <strong>{{ message.player }}</strong> has disconnected.
      </div>
    </template>

    <!-- Display queued messages -->
    <div style="opacity: 0.75; font-style: italic;" v-for="item of chat.queue">
      Sending: {{ item.say }}
    </div>
  </div>

  <div class="input">
    <input
      ref="sayInput"
      @keydown.enter="send"
      @keydown.arrow-up.prevent="recall"
      placeholder="Type here..."
      v-model="chat.say"
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
  margin-bottom: 0.5em;
  padding-right: 0.5em;
}

input {
  width: 100%;
}

.message {
  margin-bottom: 1em;
  white-space: pre-wrap;
}

.inline-img {
  height: 1em;
  align-self: center;
  margin-right: 0.25em;
}

.item-for-me {
  background: wheat;
  padding: 0.5em 0;
}
</style>