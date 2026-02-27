import { client, getItemClass, ItemClass } from '@/lib/archipelago';
import { reactive } from 'vue';

export interface TrackerItem {
  name: string;
  class: ItemClass,
  location: string;
  locationGame: string;
  sender: string;
  order: number;
}

export interface TrackerLocation {
  name: string;
  checked: boolean;
}

export const tracker = reactive({
  collected: [] as TrackerItem[],
  locations: [] as TrackerLocation[],
});

export function loadLocations() {
  tracker.locations = client.room.missingLocations.map(location => {
    const locationName = client.package.lookupLocationName(client.game, location, true)
    return {
      name: locationName,
      checked: false
    } as TrackerLocation;
  });

  tracker.locations.push(...client.room.checkedLocations.map(location => {
    const locationName = client.package.lookupLocationName(client.game, location, true)
    return {
      name: locationName,
      checked: true
    } as TrackerLocation;
  }));
}

export function loadCollectedItems() {
  tracker.collected = client.items.received.map((item, itemIndex) => {
    return {
      name: item.name,
      class: getItemClass(item),
      location: item.locationName,
      locationGame: item.locationGame,
      sender: item.sender.alias,
      senderSlot: item.sender.slot,
      senderGame: item.sender.game,
      order: itemIndex
    } as TrackerItem;
  });
}