<script setup lang="ts">
import { client, formattedHintMessage } from '@/archipelago';
import { useRouter } from 'vue-router';
import { state, type LocalPlayer, appTabs, selectedTab } from '@/state';
import { computed, markRaw, ref, watch } from 'vue';
import Chat from '@/components/Chat.vue';
import Hints from '@/components/Hints.vue';
import { clientStatuses } from 'archipelago.js';
import Players from '@/components/Players.vue';
import Help from '@/components/Help.vue';
import Tracker from '@/components/Tracker.vue';

const router = useRouter();

if (!client.authenticated) {
  const localStorageKey = 'tawc';
  const url = localStorage.getItem(`${localStorageKey}:url`) || '';
  const slot = localStorage.getItem(`${localStorageKey}:slot`) || '';
  const password = localStorage.getItem(`${localStorageKey}:password`) || '';

  const queryParams = new URLSearchParams();
  queryParams.set('url', url);
  queryParams.set('slot', slot);
  if (password) {
    queryParams.set('password', password);
  }

  router.push(`/?${queryParams.toString()}`);
}

function logout() {
  router.push('/');
}

watch(selectedTab, async () => {
  if (selectedTab.value === 'Hints') {
    state.value.hintCost = client.room.hintCost;
    state.value.hintPoints = client.room.hintPoints;

    const hints = await client.players.self.fetchHints().catch(() => [])
    state.value.hints = hints.map(hint => {
      // return formattedHintMessage(hint.item, hint.found);
      return {
        item: hint.item.name,
        found: hint.found,
        player: hint.item.receiver.alias,
        location: `<em>${hint.item.locationName}</em> in <strong>${hint.item.sender.alias}</strong>'s world`
      };
    });
  } else if (selectedTab.value === 'Players') {
    const players: LocalPlayer[] = [];

    const allPlayers = client.players.teams.flat();

    const results = await Promise.all(
      allPlayers.map(async (player) => {
        const status = await player.fetchStatus().catch(() => null);

        let statusText = '';
        switch (status) {
          case clientStatuses.connected:
            statusText = 'Connected';
            break;
          case clientStatuses.disconnected:
            statusText = 'Disconnected';
            break;
          case clientStatuses.goal:
            statusText = 'Completed';
            break;
          case clientStatuses.playing:
            statusText = 'Playing';
            break;
          case clientStatuses.ready:
            statusText = 'Ready';
            break;
        }

        return {
          name: player.alias,
          status: statusText,
          game: player.game,
          team: player.team
        };
      })
    );

    players.push(...results);
    state.value.players = players;
  } else if (selectedTab.value === 'Tracker') {
    state.value.items.collected = client.items.received.map((item, itemIndex) => {
      return {
        name: item.name,
        location: item.locationName,
        locationGame: item.locationGame,
        sender: item.sender.alias,
        order: itemIndex
      };
    });

    state.value.locations = client.room.missingLocations.map(location => {
      const locationName = client.package.lookupLocationName(client.game, location, true)
      return {
        name: locationName,
        checked: false
      };
    });

    state.value.locations.push(...client.room.checkedLocations.map(location => {
      const locationName = client.package.lookupLocationName(client.game, location, true)
      return {
        name: locationName,
        checked: true
      };
    }));
  }
});
</script>

<template>
  <div class="connected">
    <div class="window">
      <div class="title-bar">
        <div class="title-bar-text">Topher's Archipelago Web Client <span style="margin: 0 1em">|</span> <em style="font-weight: 400;">Logged in as {{ state.mySlot }}</em></div>
        <div class="title-bar-controls">
          <button @click="logout" style="padding: 0.2rem 0.5rem">Logout</button>
        </div>
      </div>
      <div class="window-body">
        <menu role="tablist">
          <li role="tab" v-for="(tab, index) of appTabs.tabs" :aria-selected="appTabs.selectedTabIndex === index">
            <a @click="appTabs.selectedTabIndex = index">{{ tab }}</a>
          </li>
        </menu>
        <div class="window" role="tabpanel" style="overflow: hidden;">
          <div class="window-body" v-show="selectedTab === 'Chat'"><Chat /></div>
          <div class="window-body" v-show="selectedTab === 'Hints'"><Hints /></div>
          <div class="window-body" v-show="selectedTab === 'Players'"><Players /></div>
          <div class="window-body" v-show="selectedTab === 'Tracker'"><Tracker /></div>
          <div class="window-body" v-show="selectedTab === 'Help'"><Help /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.connected {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  position: relative;
  background: #11007b;
  padding: 1em;
  overflow: hidden;
}

.window {
  flex: 1;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

.window-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

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

@media (max-width: 500px) {
  .connected {
    padding: 0;
  }
}

@media (max-height: 500px) {
  .connected {
    padding: 0;
  }
}

menu {
  padding-top: 0.25em;
}

menu a {
  user-select: none;
  cursor: pointer;
  padding: 0 0.5em;
}
</style>

<style>
.inline-img {
  height: 1em;
  align-self: center;
  margin-right: 0.25em;
}
</style>