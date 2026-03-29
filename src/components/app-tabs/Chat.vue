<script setup lang="ts">
import { isUserAtBottom } from '@/lib/dom-utils';
import { chat, sendMessage } from '@/state/chat';
import { nextTick, onActivated, ref, useTemplateRef, watch } from 'vue';
import { getItemStyles, getPlayerStyles } from '@/lib/theme';

// Icons
import question from '@/assets/icons/question.png';
import info from '@/assets/icons/info.png';
import user from '@/assets/icons/user.png';
import check from '@/assets/icons/check.png';
import warning from '@/assets/icons/warning.png';
import minus from '@/assets/icons/minus.png';
import warningFill from '@/assets/icons/warning-fill.png';
import world from '@/assets/icons/world.png';
import PlayerName from '../text-elements/PlayerName.vue';
import ItemName from '../text-elements/ItemName.vue';

const sayInput = useTemplateRef('sayInput');
const messagesElement = useTemplateRef('messagesElement');

const lastScrollPosition = ref(0);

onActivated(async () => {
  if (messagesElement.value) {
    if (lastScrollPosition.value === 0) {
      await nextTick();
      messagesElement.value.scrollTop = messagesElement.value.scrollHeight;
    } else {
      messagesElement.value.scrollTop = lastScrollPosition.value;
    }
  }

  if (sayInput.value) sayInput.value.focus();
});

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
        <PlayerName :alias="message.player" :slot="message.slot" :game="message.game" />: <span v-html="message.content"></span>
      </div>

      <!-- User command message -->
      <div v-else-if="message.type === 'user-command'" class="message">
        <pre style="background: #c0c0c0">{{ message.content }}</pre>
      </div>

      <!-- Tutorial message -->
      <div v-else-if="message.type === 'tutorial'" class="message">
        <img class="inline-img" :src="info"><em style="color: var(--theme-text-help);">{{ message.content }}</em>
      </div>

      <!-- Item sent -->
      <div v-else-if="message.type === 'item-sent'" class="message" :class="{ 'item-for-me': message.isForMe }">
        <img class="inline-img" :src="message.isForMe ? warningFill : warning">
        <PlayerName :alias="message.sender" :slot="message.senderSlot" :game="message.senderGame" />

        <template v-if="message.isGift">
          sent <ItemName :iclass="message.itemClass" :name="message.itemName" /> (<span style="color: var(--theme-location);">{{ message.itemLocationName }}</span>) to <PlayerName :alias="message.receiver" :slot="message.receiverSlot" :game="message.receiverGame" />
        </template>

        <template v-else>
          found their item <ItemName :iclass="message.itemClass" :name="message.itemName" /> (<span style="color: var(--theme-location);">{{ message.itemLocationName }}</span>)
        </template>
      </div>

      <!-- Item hinted -->
      <div v-else-if="message.type === 'item-hinted'" class="message">
        <img class="inline-img" :src="message.found ? check : question">
        <PlayerName :alias="message.receiver" :slot="message.receiverSlot" :game="message.receiverGame" />'s <ItemName :iclass="message.itemClass" :name="message.itemName" /> is at <em style="color: var(--theme-location);">{{ message.itemLocation }}</em> in <PlayerName :alias="message.sender" :slot="message.senderSlot" :game="message.senderGame" />'s world.
        <span v-if="message.found" style="color: green;">(found)</span>
      </div>

      <!-- Goaled -->
      <div v-else-if="message.type === 'goaled'" class="message">
        <img class="inline-img" :src="world">
        <PlayerName :alias="message.player" :slot="message.slot" :game="message.game" /> (Team {{ message.team }}) has completed their goal!
      </div>

      <!-- Connected -->
      <div v-else-if="message.type === 'connected'" class="message">
        <img class="inline-img" :src="user">
        <span style="color: var(--theme-text-join)"><PlayerName :alias="message.player" :slot="message.slot" :game="message.game" /> has joined! (Team {{ message.team }})</span>
      </div>

      <!-- Disconnected -->
      <div v-else-if="message.type === 'disconnected'" class="message">
        <PlayerName :alias="message.player" :slot="message.slot" :game="message.game" /> has disconnected.
      </div>

      <!-- Tags changed -->
      <div v-else-if="message.type === 'tag-change'" class="message">
        <PlayerName :alias="message.player" :slot="message.slot" :game="message.game" /> (Team {{ message.team }}) has changed their tags:
        <strong v-for="(tag, tagIndex) in message.tags" :key="tag">{{ tag }}<template v-if="tagIndex < message.tags.length - 1">, </template></strong>
      </div>

      <!-- Death link -->
       <div v-else-if="message.type === 'death-link'" class="message">
        <img class="inline-img" :src="minus">
        <template v-if="message.player && message.game && message.slot !== undefined">
          <PlayerName :alias="message.player" :slot="message.slot" :game="message.game" />:
        </template>
        <span style="color: var(--theme-item-trap);">{{ message.cause }}</span>
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