import { Client, Item, type ConnectionOptions, type JSONRecord, type JSONSerializable } from 'archipelago.js';
import { MessageParsing } from '../state/chat';
import { safeAsync, type SafePromiseError } from './async-utils';
import { ref } from 'vue';
import { tawcBounces } from './bounces';
import { loadHints } from '@/state/hints';

export const client = new Client();

// Setup necessary for manual caching
export const datapackageChecksums = ref<Record<string, string>>({});
client.options.autoFetchDataPackage = false;

client.messages.on('connected', (text, player, tags, nodes) => MessageParsing.addConnectedMessage(player));
client.messages.on('disconnected', (text, player, nodes) => MessageParsing.addDisconnectedMessage(player));
client.messages.on('goaled', (text, player, nodes) => MessageParsing.addGoaledMessage(player));
client.messages.on('itemHinted', (text, item, found, nodes) => MessageParsing.addItemHintedMessage(item, found, nodes));
client.messages.on('itemSent', (text, item, nodes) => MessageParsing.addItemSentMessage(item));
client.messages.on('tutorial', (text, nodes) => MessageParsing.addTutorialMessage(nodes));
client.messages.on('userCommand', (text, nodes) => MessageParsing.addUserCommandMessage(nodes));
client.messages.on('chat', (message, player, nodes) => MessageParsing.addPlayerChatMessage(message, player))
client.messages.on('tagsUpdated', (text, player, tags, nodes) => MessageParsing.addTagChangeMessage(player, tags));
client.socket.on('bounced', (packet, data) => {
  let handled = false;
  if (data && data.__twac && typeof data.__signal === 'string') {
    for (const tawcBounce of tawcBounces) {
      if (tawcBounce.signal === data.__signal) {
        tawcBounce.handler(data.data as any);
        handled = true;
        break;
      }
    }
  }

  if (handled) return;

  MessageParsing.addBouncedMessage(packet, data)
});

// Unclassified messages (these just appear as unformatted text in the chat window)
client.messages.on('released', (text, player, nodes) => MessageParsing.addUnclassifiedMessage(nodes));
client.messages.on('serverChat', (message, nodes) => MessageParsing.addUnclassifiedMessage(nodes));
client.messages.on('itemCheated', (text, item, nodes) => MessageParsing.addUnclassifiedMessage(nodes));
client.messages.on('countdown', (text, value, nodes) => MessageParsing.addUnclassifiedMessage(nodes));
client.messages.on('adminCommand', (text, nodes) => MessageParsing.addUnclassifiedMessage(nodes));
client.messages.on('collected', (text, player, nodes) => MessageParsing.addUnclassifiedMessage(nodes));

// React to new hints
client.items.on('hintReceived', () => loadHints());
client.items.on('hintFound', () => loadHints());
client.items.on('hintStatusChanged' as any, () => loadHints());

/** Logs in a user with the server */
export async function login(url: string, slot: string, password?: string) {
  const options: ConnectionOptions = password ? { password } : {};
  options.tags = ['TextOnly', 'Tracker']

  client.socket.disconnect();

  // Archipelago.js does not expose checksums anywhere, but we need this
  // for caching reasons so we can manually connect first to get them
  const { data, success } = await safeAsync(client.socket.connect(url));
  if (!success) {
    return {
      success: false,
      data: null,
      error: new Error(),
      message: 'Failed to connect to server'
    } as SafePromiseError;
  }

  datapackageChecksums.value = data.datapackage_checksums;

  // Login only after we have our checksums
  return await safeAsync(client.login(url, slot, undefined, options));
}

export enum ItemClass {
  NORMAL,
  USEFUL,
  PROGRESSION,
  TRAP
}

export function getItemClass(item: Item) {
  const classes = [];
  if (item.useful) classes.push(ItemClass.USEFUL);
  if (item.progression) classes.push(ItemClass.PROGRESSION);
  if (item.trap) classes.push(ItemClass.TRAP);
  if (classes.length === 0) classes.push(ItemClass.NORMAL);
  return classes;
}

export function sortItemClasses(itemClasses: ItemClass[]) {
  const ORDER = [ItemClass.PROGRESSION, ItemClass.USEFUL, ItemClass.TRAP, ItemClass.NORMAL];
  return itemClasses.slice().sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
}

export function itemClassToString(itemClass: ItemClass) {
  switch (itemClass) {
    case ItemClass.PROGRESSION:
      return 'Progression';
    case ItemClass.USEFUL:
      return 'Useful';
    case ItemClass.TRAP:
      return 'Trap';
    default:
      return 'Normal';
  }
}

const storageKey = (slot: number, key: string) => `-tawc-${slot}-${key}`;

export function storageSetSlot(slot: number, key: string, value: JSONSerializable) {
  const localKey = storageKey(slot, key);
  client.storage.prepare(localKey, value).replace(value).commit();
}

export function storageGetSlot(slot: number, key: string) {
  const localKey = storageKey(slot, key);
  return client.storage.fetch(localKey, false);
}

// Expose client to console during development
if (import.meta.env.DEV) {
  (window as any).client = client;
}