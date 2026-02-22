<script setup lang="ts">
import { state } from '@/state';

</script>

<template>
  <div class="players">
    <template v-if="state.players.length === 0">
      <p>Loading players, please wait...</p>
    </template>
    <template v-for="player of state.players">
      <fieldset>
        <legend><strong>{{ player.name }}</strong></legend>
        <div>
          <strong>Game</strong>: {{ player.game }}
        </div>
        <div>
          <strong>Status</strong>: <span :class="[player.status]">{{ player.status }}</span>
        </div>
        <div>
          <strong>Team</strong>: {{ player.team + 1 }}
        </div>
      </fieldset>
    </template>
  </div>
</template>

<style scoped>
.players {
  overflow: auto;
  padding-right: 1em;
}

fieldset {
  margin-bottom: 1em;
}

.Disconnected {
  color: red;
  font-weight: bold;
}

.Completed {
  color: blue;
  font-weight: bold;
}

.Connected {
  color: green;
  font-weight: bold;
}
</style>