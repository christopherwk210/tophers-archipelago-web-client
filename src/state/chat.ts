import { client, getItemClass, ItemClass } from '@/lib/archipelago';
import type { Item, MessageNode, Player, SayPacket } from 'archipelago.js';
import { reactive } from 'vue';
import { settings } from './settings';
import { playSound } from '@/lib/audio';
import { jsConfetti } from '@/lib/confetti';

// Namespace dedicated to parsing archipelago.js messages into local data
export namespace MessageParsing {
  interface ChatMessageBase {
    type: string;
  }

  interface ChatMessageContentBase extends ChatMessageBase {
    content: string;
  }

  interface ChatMessagePlayerChat extends ChatMessageContentBase {
    type: 'player-chat';
    player: string;
    slot: number;
    game: string;
  }

  interface ChatMessageItemSent extends ChatMessageBase {
    type: 'item-sent';
    sender: string;
    senderSlot: number;
    senderGame: string;
    receiver: string;
    receiverSlot: number;
    receiverGame: string;
    itemName: string;
    itemLocationName: string;
    itemClass: ItemClass[];
    isForMe: boolean;
    isGift: boolean;
  }

  interface ChatMessageItemHinted extends ChatMessageBase {
    type: 'item-hinted';
    receiver: string;
    receiverGame: string;
    receiverSlot: number;
    sender: string;
    senderGame: string;
    senderSlot: number;
    itemName: string;
    itemLocation: string;
    itemClass: ItemClass[];
    found: boolean;
  }

  interface ChatMessageGoaled extends ChatMessageBase {
    type: 'goaled';
    player: string;
    slot: number;
    game: string;
    team: number;
  }

  interface ChatMessageConnected extends ChatMessageBase {
    type: 'connected';
    player: string;
    slot: number;
    game: string;
    team: number;
  }

  interface ChatMessageDisconnected extends ChatMessageBase {
    type: 'disconnected';
    player: string;
    slot: number;
    game: string;
  }

  interface ChatMessageUnclassified extends ChatMessageContentBase { type: 'none'; }
  interface ChatMessageUserCommand extends ChatMessageContentBase { type: 'user-command'; }  
  interface ChatMessageTutorial extends ChatMessageContentBase { type: 'tutorial'; }  

  export type ChatMessage =
    ChatMessageUnclassified
    | ChatMessagePlayerChat
    | ChatMessageUserCommand
    | ChatMessageTutorial
    | ChatMessageItemSent
    | ChatMessageItemHinted
    | ChatMessageGoaled
    | ChatMessageConnected
    | ChatMessageDisconnected
    ;

  /**
   * Converts basic Markdown syntax to HTML
   */
  function basicMarkdownToHtml(input: string) {
    let html = input;

    // Bold (**text** or __text__)
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic (*text* or _text_)
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    return html;
  }

  function nodesToText(nodes: MessageNode[]) {
    return nodes.map(n => n.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')).join();
  }

  /** Adds an unclassified message to the chat with no special formatting */
  export function addUnclassifiedMessage(nodes: MessageNode[]) {
    const joinedMessage = nodesToText(nodes)
    chat.messages.push({
      type: 'none',
      content: joinedMessage
    });
  }

  /** This is a chat message sent by a player */
  export function addPlayerChatMessage(message: string, player: Player) {
    // Check if the text is a link
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    message = message.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    // Apply basic markdown
    message = basicMarkdownToHtml(message.replace(/</g, '&lt;').replace(/>/g, '&gt;'));

    chat.messages.push({
      type: 'player-chat',
      player: player.alias,
      content: message,
      slot: player.slot,
      game: player.game
    });
  }

  /** The result of a user command */
  export function addUserCommandMessage(nodes: MessageNode[]) {
    const joinedMessage = nodesToText(nodes)
    chat.messages.push({
      type: 'user-command',
      content: joinedMessage
    });
  }

  /** Tutorial messages usually sent in response to actions */
  export function addTutorialMessage(nodes: MessageNode[]) {
    const joinedMessage = nodesToText(nodes)
    chat.messages.push({
      type: 'tutorial',
      content: joinedMessage
    });
  }

  /** For when a player sends an item */
  export function addItemSentMessage(item: Item) {
    const isForMe = item.receiver.name === client.players.self.name && item.receiver.slot === client.players.self.slot;
    const isGift = !(item.sender.alias === item.receiver.alias && item.sender.slot === item.receiver.slot);
    const itemClass = getItemClass(item);

    if (isForMe && settings.value.notificationsItemSent) {
      if (itemClass.includes(ItemClass.PROGRESSION)) {
        if (settings.value.notificationsItemSentProgression) playSound('notify');
      } else if (itemClass.includes(ItemClass.USEFUL)) {
        if (settings.value.notificationsItemSentUseful) playSound('notify');
      } else if (itemClass.includes(ItemClass.TRAP)) {
        if (settings.value.notificationsItemSentTrap) playSound('notify');
      } else {
        if (settings.value.notificationsItemSentNormal) playSound('notify');
      }
    }

    chat.messages.push({
      type: 'item-sent',
      sender: item.sender.alias,
      senderGame: item.sender.game,
      receiverGame: item.receiver.game,
      receiver: item.receiver.alias,
      senderSlot: item.sender.slot,
      receiverSlot: item.receiver.slot,
      itemName: item.name,
      itemLocationName: item.locationName,
      itemClass,
      isForMe,
      isGift
    });
  }

  /** The system response for asking for a hint for an item */
  export function addItemHintedMessage(item: Item, found: boolean) {
    chat.messages.push({
      type: 'item-hinted',
      sender: item.sender.alias,
      receiver: item.receiver.alias,
      itemName: item.name,
      itemLocation: item.locationName,
      itemClass: getItemClass(item),
      found,
      receiverGame: item.receiver.game,
      receiverSlot: item.receiver.slot,
      senderGame: item.sender.game,
      senderSlot: item.sender.slot,
    });
  }

  /** When someone achieves their goal */
  export function addGoaledMessage(player: Player) {
    jsConfetti.addConfetti();

    chat.messages.push({
      type: 'goaled',
      player: player.alias,
      slot: player.slot,
      game: player.game,
      team: player.team + 1
    });
  }

  export function addConnectedMessage(player: Player) {
    if (settings.value.notificationsPlayerConnected) playSound('chimes');

    chat.messages.push({
      type: 'connected',
      player: player.alias,
      slot: player.slot,
      game: player.game,
      team: player.team + 1
    });
  }

  export function addDisconnectedMessage(player: Player) {
    chat.messages.push({
      type: 'disconnected',
      player: player.alias,
      slot: player.slot,
      game: player.game
    });
  }
}

export const chat = reactive({
  /** What is currently being typed in the box */
  say: '',

  /** Messages currently being sent */
  queue: [] as { say: string; id: number; }[],

  /** Used for tracking queue messages */
  lastQueueId: 0,

  /** The contents of the last message sent */
  lastSay: '',

  /** The full chat log */
  messages: [] as MessageParsing.ChatMessage[],

  /** Custom chat commands */
  customCommands: {
    '/clear': () => {
      chat.say = '';
      chat.messages = [];
    }
  } as Record<string, () => void>,
});

/** Send a message to the server */
export async function sendMessage(override?: string) {
  const message = override ?? chat.say;

  // Don't send empty messages
  if (message.trim().length === 0) return;

  // Handle custom commands
  for (const command in chat.customCommands) {
    if (message.startsWith(command)) {
      chat.customCommands[command]!();
      return;
    }
  }

  // Queue up this message
  const id = chat.lastQueueId++;
  const saying = message;
  chat.queue.push({ say: saying, id });
  chat.say = '';

  // There is an outstanding bug in archipelago.js that handles !admin commands incorrectly, so we have to do it manually
  if (saying.startsWith('!admin')) {
    const request: SayPacket = { cmd: 'Say', text: saying };
    client.socket.send(request);
  } else {
    await client.messages.say(saying).catch(() => {})
  }

  // Remove this item from the queue
  chat.queue = chat.queue.filter(item => item.id !== id);

  // Update the last sent message for recall
  chat.lastSay = saying;
}