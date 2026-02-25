import { Client } from 'archipelago.js';
import { MessageParsing } from '../state/chat';
import { safeCall } from './async-utils';

export const client = new Client();

client.messages.on('connected', (text, player, tags, nodes) => MessageParsing.addConnectedMessage(player));
client.messages.on('disconnected', (text, player, nodes) => MessageParsing.addDisconnectedMessage(player));
client.messages.on('goaled', (text, player, nodes) => MessageParsing.addGoaledMessage(player));
client.messages.on('itemHinted', (text, item, found, nodes) => MessageParsing.addItemHintedMessage(item, found));
client.messages.on('itemSent', (text, item, nodes) => MessageParsing.addItemSentMessage(item));
client.messages.on('tutorial', (text, nodes) => MessageParsing.addTutorialMessage(nodes));
client.messages.on('userCommand', (text, nodes) => MessageParsing.addUserCommandMessage(nodes));
client.messages.on('chat', (message, player, nodes) => MessageParsing.addPlayerChatMessage(message, player))

// Unclassified messages (these just appear as unformatted text in the chat window)
client.messages.on('released', (text, player, nodes) => MessageParsing.addUnclassifiedMessage(nodes));
client.messages.on('serverChat', (message, nodes) => MessageParsing.addUnclassifiedMessage(nodes));
client.messages.on('tagsUpdated', (text, player, tags, nodes) => MessageParsing.addUnclassifiedMessage(nodes));
client.messages.on('itemCheated', (text, item, nodes) => MessageParsing.addUnclassifiedMessage(nodes));
client.messages.on('countdown', (text, value, nodes) => MessageParsing.addUnclassifiedMessage(nodes));
client.messages.on('adminCommand', (text, nodes) => MessageParsing.addUnclassifiedMessage(nodes));
client.messages.on('collected', (text, player, nodes) => MessageParsing.addUnclassifiedMessage(nodes));

/** Logs in a user with the server */
export async function login(url: string, slot: string, password?: string) {
  const options = password ? { password } : undefined;
  return await safeCall(client.login(url, slot, undefined, options));
}

// Expose client to console during development
if (import.meta.env.DEV) {
  (window as any).client = client;
}