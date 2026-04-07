<script setup lang="ts">
import { isUserAtBottom } from '@/lib/dom-utils';
import { chat, commandHints, sendMessage, type CommandHint } from '@/state/chat';
import { computed, nextTick, onActivated, onDeactivated, ref, useTemplateRef, watch } from 'vue';

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
import { useElementBounding } from '@vueuse/core';
import { getCssVarFromStatus, getHintStatusName, HintStatus } from '@/state/hints';

const sayInput = useTemplateRef('sayInput');
const messagesElement = useTemplateRef('messagesElement');

const inputBoundingBox = useElementBounding(sayInput, {
  windowResize: true,
  immediate: true
});

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

onDeactivated(() => {
  hintSelected.value = 0;
  currentHintMatches.value = [];
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

function keyDown(e: KeyboardEvent) {
  switch (e.key) {
    case 'Enter':
      if (currentHintMatches.value.length > 0 && !chat.say.startsWith(currentHintMatches.value[hintSelected.value]!.cmd)) {
        e.preventDefault();
        chat.say = currentHintMatches.value[hintSelected.value]!.cmd;
        hintSelected.value = 0;
      } else {
        send();
      }
      break;
    case 'ArrowUp':
      if (chat.say.trim().length === 0 && chat.lastSay.trim().length > 0) {
        e.preventDefault();
        recall();
      } else if (currentHintMatches.value.length > 0) {
        e.preventDefault();
        if (hintSelected.value > 0) {
          hintSelected.value--;
        } else {
          hintSelected.value = currentHintMatches.value.length - 1;
        }
      }
      break;
    case 'ArrowDown':
      if (currentHintMatches.value.length > 0) {
        e.preventDefault();
        if (hintSelected.value < currentHintMatches.value.length - 1) {
          hintSelected.value++;
        } else {
          hintSelected.value = 0;
        }
      }
      break;
    case 'Tab':
      if (currentHintMatches.value.length > 0) {
        e.preventDefault();
        chat.say = currentHintMatches.value[hintSelected.value]!.cmd;
        hintSelected.value = 0;
      }
      break;
  }
}

const currentHintMatches = ref<CommandHint[]>([]);
const hintSelected = ref(0);

watch(() => chat.say, () => {
  if (chat.say.trim().length === 0) {
    currentHintMatches.value = [];
    hintSelected.value = 0;
  } else {
    currentHintMatches.value = commandHints.value.filter(hint => {
      return hint.cmd.indexOf(chat.say.split(' ')[0]!) === 0
    });
  }
});

watch(() => hintSelected.value, () => {
  const element = document.querySelector(`.command-hint[data-hint-index="${hintSelected.value}"]`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});

const commandHintStyles = computed(() => {
  return {
    left: inputBoundingBox.left.value + 'px',
    bottom: (window.innerHeight - inputBoundingBox.top.value) + 8 + 'px',
    width: inputBoundingBox.width.value + 'px',
  }
});

async function acceptHint(index: number) {
  chat.say = currentHintMatches.value[index]!.cmd;
  await nextTick();
  if (sayInput.value) sayInput.value.focus();
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
        <span v-if="message.status" :style="{ color: getCssVarFromStatus(message.status) }">({{ getHintStatusName(message.status) }})</span>
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

      <!-- Confetti -->
      <div v-else-if="message.type === 'confetti'" class="message">
        <img class="inline-img" style="opacity: 0; pointer-events: none;" :src="info">
        <span style="color: var(--theme-text-join);"><PlayerName :alias="message.player" :slot="message.slot" :game="message.game" /> <strong>sends confetti</strong></span> 🎉
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
      @keydown="keyDown"
      placeholder="Type here..."
      v-model="chat.say"
      id="say"
      type="text"
      spellcheck="false"
      autocomplete="off"
      autocapitalize="none"
    />
  </div>

  <div v-if="currentHintMatches.length > 0" :style="commandHintStyles" class="command-hints">
    <div @click="acceptHint(hintIndex)" :data-hint-index="hintIndex" :class="{ selected: hintSelected === hintIndex }" class="command-hint" v-for="(hint, hintIndex) in currentHintMatches">
      <img v-if="hint.isCustom" src="@/assets/icons/world.png">
      <img v-else src="@/assets/images/archipelago-icon.png">
      <div>
        <strong>{{ hint.cmd }}</strong> {{ hint.args.join(' ') }}
        <br>
        <small style="opacity: 0.8">{{ hint.help }}</small>
      </div>
    </div>
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

.command-hints {
  position: fixed;
  background: #192327;
  color: white;
  border-radius: 4px;
  line-height: 1.25;
  max-height: 300px;
  overflow: auto;
  padding: 0.2em;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.command-hint {
  padding: 0.3em;
  cursor: pointer;
  user-select: none;
  border-radius: 4px;
  margin-bottom: 0.3em;
  display: flex;
  gap: 0.5em;
}

.command-hint > img {
  height: 2em;
  width: 2em;
}

.command-hint:last-child {
  margin-bottom: 0;
}

.command-hint:hover, .command-hint.selected {
  background: rgba(255, 255, 255, 0.1);
}
</style>