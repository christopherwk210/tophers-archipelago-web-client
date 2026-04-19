import { client, getItemClass, ItemClass } from '@/lib/archipelago';
import type { BouncedPacket, Item, JSONRecord, MessageNode, Player, SayPacket } from 'archipelago.js';
import { reactive, ref } from 'vue';
import { settings } from './settings';
import { playSound } from '@/lib/audio';
import { jsConfetti } from '@/lib/confetti';
import { loadPlayers, players } from './players';
import { AppTab, appTabManager } from './tabs';
import { tawcBounce } from '@/lib/bounces';
import { HintStatus } from './hints';
import { desktopNotify } from '@/lib/desktop-notifications';

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
    rawContent: string;
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
    status: HintStatus;
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

  interface ChatMessageTagChange extends ChatMessageBase {
    type: 'tag-change';
    player: string;
    slot: number;
    game: string;
    team: number;
    tags: string[];
  }

  interface ChatMessageDeathLink extends ChatMessageBase {
    type: 'death-link';
    player?: string;
    slot?: number;
    game?: string;
    cause: string;
  }

  interface ChatMessageConfetti extends ChatMessageBase {
    type: 'confetti';
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
    | ChatMessageTagChange
    | ChatMessageDeathLink
    | ChatMessageConfetti
    ;

  /**
   * Converts basic Markdown syntax to HTML
   */
  function basicMarkdownToHtml(input: string) {
    let html = input;

    // Protect emoticons
    const emoticons = [
      '¯\\_(ツ)_/¯',
      `(╯°□°)╯︵ ┻━┻`,
      `┬─┬ノ( º _ ºノ)`
    ];

    const placeholders = emoticons.map(() => `$$PLACEHOLDER$${Math.random().toString(36)}$$`);

    placeholders.forEach((placeholder, index) => {
      html = html.split(emoticons[index]!).join(placeholder);
    });

    // Bold (**text** or __text__)
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic (*text* or _text_)
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Code (`text`)
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');

    placeholders.forEach((placeholder, index) => {
      html = html.split(placeholder).join(emoticons[index]!);
    });

    html = html.replace(/(burger king)/gi, '<strong data-tippy-content="Burger King" style="font-size: 1.1em; cursor: cell;">Burger King</strong>');

    return html;
  }

  function nodesToText(nodes: MessageNode[]) {
    return nodes.map(n => n.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')).join();
  }

  /** Adds an unclassified message to the chat with no special formatting */
  export function addUnclassifiedMessage(nodes: MessageNode[]) {
    const joinedMessage = nodesToText(nodes);
    chat.messages.push({
      type: 'none',
      content: joinedMessage
    });
  }

  export function addTagChangeMessage(player: Player, tags: string[]) {
    if (!settings.value.logTagChanges) return;

    chat.messages.push({
      type: 'tag-change',
      player: player.alias,
      slot: player.slot,
      game: player.game,
      team: player.team + 1,
      tags
    });
  }

  export function addBouncedMessage(packet: BouncedPacket, data: JSONRecord) {
    if (!data) return;

    if (packet.tags && Array.isArray(packet.tags) && packet.tags.includes('DeathLink')) {
      if (data && data.cause && data.source) {
        addDeathlinkMessage(data.cause as string, data.source as string);
      }
    }
  }

  export async function addDeathlinkMessage(cause: string, source: string) {
    // Attempt to find the player object
    if (players.value.length === 0) await loadPlayers();
    const playerNameOrSlot = source;

    const foundPlayer = players.value.find(player => player.name === playerNameOrSlot);

    if (foundPlayer) {
      chat.messages.push({
        type: 'death-link',
        player: foundPlayer.name,
        game: foundPlayer.game,
        slot: foundPlayer.slot,
        cause
      });
    } else {
      chat.messages.push({
        type: 'death-link',
        player: source,
        cause
      });
    }
  }

  /** This is a chat message sent by a player */
  export function addPlayerChatMessage(message: string, player: Player) {
    if (message === '!status' && appTabManager.currentTabIndex.value === AppTab.PLAYERS) return;

    const rawContent = message;

    // Check if the text is a link
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const messageIsLink = urlRegex.test(message);

    if (messageIsLink) {
      message = message.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
      });
    } else {
      // Apply basic markdown
      message = basicMarkdownToHtml(message.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    }

    chat.messages.push({
      type: 'player-chat',
      player: player.alias,
      content: message,
      slot: player.slot,
      game: player.game,
      rawContent
    });
  }

  /** The result of a user command */
  export function addUserCommandMessage(nodes: MessageNode[]) {
    const joinedMessage = nodesToText(nodes);

    let shouldHide = false;
    if (joinedMessage.toLowerCase().trim().startsWith('player status on team')) {
      if (appTabManager.currentTabIndex.value === AppTab.PLAYERS) shouldHide = true;

      const lines = joinedMessage.split('\n');
      lines.shift();

      const allPlayers = client.players.teams.flat();
      for (const player of allPlayers) {
        const playerLine = lines.find(line => line.startsWith(player.name) || line.startsWith(player.alias));
        if (!playerLine) continue;

        const lastOpen = playerLine.lastIndexOf('(');
        const lastClose = playerLine.lastIndexOf(')');

        if (lastOpen === -1 || lastClose === -1 || lastClose < lastOpen) continue;

        const content = playerLine.slice(lastOpen + 1, lastClose);
        const [collected, total] = content.split('/').map(Number);

        if (typeof collected !== 'number' || typeof total !== 'number' || total === 0) continue;

        players.value.find(p => p.slot === player.slot)!.progress = Math.round(collected / total * 100);
      }
    }

    if (shouldHide) return;

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
        if (settings.value.notificationsItemSentProgression) {
          desktopNotify(`Progression Item Received`, {
            body: `${item.sender.alias} sent you ${item.name}`
          });
          playSound('notify');
        }
      } else if (itemClass.includes(ItemClass.USEFUL)) {
        if (settings.value.notificationsItemSentUseful) {
          desktopNotify(`Useful Item Received`, {
            body: `${item.sender.alias} sent you ${item.name}`
          });
          playSound('notify');
        }
      } else if (itemClass.includes(ItemClass.TRAP)) {
        if (settings.value.notificationsItemSentTrap) {
          desktopNotify(`Trap Item Received`, {
            body: `${item.sender.alias} sent you ${item.name}`
          });
          playSound('notify');
        }
      } else {
        if (settings.value.notificationsItemSentNormal) {
          desktopNotify(`Item Received`, {
            body: `${item.sender.alias} sent you ${item.name}`
          });
          playSound('notify');
        }
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
  export function addItemHintedMessage(item: Item, found: boolean, nodes: MessageNode[]) {
    const hintStatusNode: any = nodes.find((node: any) => node.type === 'text' && node.part && node.part.type === 'hint_status');
    let status: HintStatus = HintStatus.UNSPECIFIED;
    if (hintStatusNode && hintStatusNode.part) {
      const statusCode = hintStatusNode.part.hint_status;
      const validHint = !!HintStatus[statusCode];
      if (validHint) {
        status = statusCode;
      }
    }

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
      status
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
    if (settings.value.notificationsPlayerConnected) {
      if (settings.value.notificationsUseDesktop) {
        desktopNotify('Player Connected', {
          body: `${player.alias} has joined!`
        });
      }

      playSound('chimes');
    }

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

export interface CommandHint {
  cmd: string;
  args: string[];
  help: string;
  isCustom?: boolean;
}

export const commandHints = ref<CommandHint[]>([
  {
    cmd: '!help',
    args: [],
    help: 'Returns a listing of available commands.'
  },
  {
    cmd: '!license',
    args: [],
    help: 'Returns the software licensing information.'
  },
  {
    cmd: '!options',
    args: [],
    help: 'Returns the current server options, including password in plaintext.'
  },
  {
    cmd: '!status',
    args: ['[tag name]'],
    help: 'Returns information about the connection status and check completion numbers for all players in the current room. Optionally mention a Tag name and get information on who has that Tag. For example: !status DeathLink'
  },
  {
    cmd: '!countdown',
    args: ['[seconds]'],
    help: 'Starts a countdown using the given seconds value. Useful for synchronizing starts. Defaults to 10 seconds if no argument is provided.'
  },
  {
    cmd: '!alias',
    args: ['[alias]'],
    help: `Sets your alias, which allows you to use commands with the alias rather than your provided name. !alias on its own will reset the alias to the player's original name.`
  },
  {
    cmd: '!admin',
    args: ['[command]'],
    help: 'Executes a command as if you typed it into the server console. Remote administration must be enabled.'
  },
  {
    cmd: '!remaining',
    args: [],
    help: 'Lists the items remaining in your game, but not where they are or who they go to.'
  },
  {
    cmd: '!missing',
    args: [],
    help: `Lists the location checks you are missing from the server's perspective.`
  },
  {
    cmd: '!checked',
    args: [],
    help: `Lists all the location checks you've done from the server's perspective.`
  },
  {
    cmd: '!hint',
    args: ['[item name]'],
    help: 'Lists all hints relevant to your world, the number of points you have for hints, and how much a hint costs. If an item name is provided, tells you the game world and location your item is in, uses points earned from completing locations.'
  },
  {
    cmd: '!hint_location',
    args: ['[location]'],
    help: 'Tells you what item is in a specific location, uses points earned from completing locations.'
  },
  {
    cmd: '!collect',
    args: [],
    help: 'Grants you all the remaining items for your world by collecting them from all games. Typically used after goal completion.'
  },
  {
    cmd: '!release',
    args: [],
    help: 'Releases all items contained in your world to other worlds. Typically, done automatically by the server, but can be configured to allow/require manual usage of this command.'
  },

  // {
  //   cmd: '/clear',
  //   args: [],
  //   help: 'Clears the local chat history.',
  //   isCustom: true
  // },
  // {
  //   cmd: '/confetti',
  //   args: [],
  //   help: 'Triggers a confetti celebration for everyone using Topher\'s Archipelago Web Client, including you!',
  //   isCustom: true
  // }
]);

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
  customCommands: {} as Record<string, () => void>,
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
    await client.messages.say(saying).catch(() => {});
  }

  // Remove this item from the queue
  chat.queue = chat.queue.filter(item => item.id !== id);

  // Update the last sent message for recall
  chat.lastSay = saying;
}