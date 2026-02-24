<script setup lang="ts">
import { state } from '@/state';
import { computed, ref } from 'vue';
import check from '@/assets/icons/check.png';
import minus from '@/assets/icons/minus.png';

const collectedSelectedRow = ref(-1);
const collectedSortBy = ref<'name' | 'sender' | 'locationGame' | 'location' | 'order'>('order');
const collectedSortOrder = ref<'asc' | 'desc'>('desc');
const collectedSorted = computed(() => {
  return [...state.value.items.collected].sort((a, b) => {
    const modifier = collectedSortOrder.value === 'asc' ? 1 : -1;
    if (a[collectedSortBy.value] < b[collectedSortBy.value]) return -1 * modifier;
    if (a[collectedSortBy.value] > b[collectedSortBy.value]) return 1 * modifier;
    return 0;
  });
});

function collectedSortByColumn(column: 'name' | 'sender' | 'locationGame' | 'location' | 'order') {
  if (collectedSortBy.value === column) {
    collectedSortOrder.value = collectedSortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    collectedSortBy.value = column;
    collectedSortOrder.value = 'asc';
  }
}

const locationSelectedRow = ref(-1);
const locationSortBy = ref<'name' | 'checked'>('checked');
const locationSortOrder = ref<'asc' | 'desc'>('asc');
const locationSorted = computed(() => {
  return [...state.value.locations].sort((a, b) => {
    const modifier = locationSortOrder.value === 'asc' ? 1 : -1;
    if (a[locationSortBy.value] < b[locationSortBy.value]) return -1 * modifier;
    if (a[locationSortBy.value] > b[locationSortBy.value]) return 1 * modifier;
    return 0;
  });
});

function locationSortByColumn(column: 'name' | 'checked') {
  if (locationSortBy.value === column) {
    locationSortOrder.value = locationSortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    locationSortBy.value = column;
    locationSortOrder.value = 'asc';
  }
}

const totalLocations = computed(() => state.value.locations.length);
const totalCheckedLocations = computed(() => state.value.locations.filter(loc => loc.checked).length);

const tabs = ref([
  'Collected',
  'Locations'
]);
const selectedTabIndex = ref(0);
const selectedTab = computed<string>(() => tabs.value[selectedTabIndex.value]!);
</script>

<template>
  <div class="tracker">
    <menu role="tablist">
      <li role="tab" v-for="(tab, index) of tabs" :aria-selected="selectedTabIndex === index">
        <a @click="selectedTabIndex = index">
          {{ tab }}
          <template v-if="tab === 'Locations'">
            ({{ totalCheckedLocations }} / {{ totalLocations }})
          </template>
        </a>
      </li>
    </menu>
    <div class="window" role="tabpanel" style="overflow: hidden; flex: 1; display: flex; flex-direction: column;">
      <div class="window-body" v-show="selectedTab === 'Collected'">
        <div class="sunken-panel">
          <table class="interactive">
            <thead>
              <tr>
                <th></th>
                <th @click="collectedSortByColumn('order')">Order</th>
                <th @click="collectedSortByColumn('name')">Name</th>
                <th @click="collectedSortByColumn('sender')">Finder</th>
                <th @click="collectedSortByColumn('locationGame')">Source Game</th>
                <th @click="collectedSortByColumn('locationGame')">Location</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) of collectedSorted" @click="collectedSelectedRow = index" :class="{ highlighted: collectedSelectedRow === index }">
                <td><img :src="check"></td>
                <td>{{ item.order }}</td>
                <td>{{ item.name }}</td>
                <td><strong>{{ item.sender }}</strong></td>
                <td>{{ item.locationGame }}</td>
                <td>{{ item.location }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="window-body" v-show="selectedTab === 'Locations'">
        <div class="sunken-panel">
          <table class="interactive">
            <thead>
              <tr>
                <th @click="locationSortByColumn('checked')">Checked</th>
                <th @click="locationSortByColumn('name')">Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) of locationSorted" @click="locationSelectedRow = index" :class="{ highlighted: locationSelectedRow === index }">
                <td style="text-align: center"><img :src="item.checked ? check : minus"></td>
                <td>{{ item.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tracker {
  overflow: auto;
  display: flex;
  flex-direction: column;
  flex: 1;
}

table {
  width: 100%;
}

.sunken-panel {
  flex: 1;
}

thead {
  user-select: none;
}

tr {
  cursor: pointer;
}

td {
  padding: 0.5em;
}

th:hover {
  background: #dfdfdf;
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
  overflow: auto;
}
</style>