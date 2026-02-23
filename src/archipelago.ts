import { Client, Item, type MessageNode } from 'archipelago.js';
import { ref, markRaw } from 'vue';

import question from '@/assets/icons/question.png';
import info from '@/assets/icons/info.png';
import user from '@/assets/icons/user.png';
import check from '@/assets/icons/check.png';

// export type Message = { text: string; nodes: MessageNode[]; };
// export const messages = ref<Message[]>([]);

export const messages = ref<string[]>([]);

export const client = new Client();

client.messages.on('message', (text, nodes) => {
  // messages.value.push({ text, nodes: nodes.map(n => markRaw(n)) });
});

client.messages.on('adminCommand', (text, nodes) => {
  const joinedMessage = nodesToText(nodes)
  messages.value.push(joinedMessage);
});

client.messages.on('collected', (text, player, nodes) => {
  const joinedMessage = nodesToText(nodes)
  messages.value.push(joinedMessage);
});

client.messages.on('connected', (text, player, tags, nodes) => {
  const msg = `${player.alias} has joined!`;

  messages.value.push(`<img class="inline-img" src="${user}"><span style="color: #006400">${msg}</span>`);
  messages.value.push(`<span style="color: #006400">${player.game} - Team ${player.team + 1}</span>`);
});

client.messages.on('countdown', (text, value, nodes) => {
  const joinedMessage = nodesToText(nodes)
  messages.value.push(joinedMessage);
});

client.messages.on('disconnected', (text, player, nodes) => {
  let output = `<strong>${player.alias}</strong> has disconnected.`;
  messages.value.push(output);
});

client.messages.on('goaled', (text, player, nodes) => {
  let output = `<strong>${player.alias}</strong> (Team ${player.team + 1}) has completed their goal!`;
  messages.value.push(output);
});

client.messages.on('itemCheated', (text, item, nodes) => {
  const joinedMessage = nodesToText(nodes)
  messages.value.push(joinedMessage);
});

client.messages.on('itemHinted', (text, item, found, nodes) => {
  messages.value.push(formattedHintMessage(item, found));
});

export function formattedHintMessage(item: Item, found: boolean) {
  let output = `<strong>${item.receiver.alias}</strong>'s <em>"${item.name}"</em> is at <em>"${item.locationName}"</em> in <strong>${item.sender.alias}</strong>'s world.`;

  if (found) {
    output = `<img class="inline-img" src="${check}">${output}`;
    output += ` <span style="color: green;">(found)</span>`;
  } else {
    output = `<img class="inline-img" src="${question}">${output}`;
  }

  return output;
}

client.messages.on('itemSent', (text, item, nodes) => {
  let output = `<strong>${item.sender.alias}</strong>`;
  if (item.sender.alias === item.receiver.alias && item.sender.slot === item.receiver.slot) {
    output += ` found their item <em>"${item.name}"</em>! (${item.locationName})`;
  } else {
    output += ` sent <em>"${item.name}"</em> (${item.locationName}) to <strong>${item.receiver.alias}</strong>!`;
  }

  messages.value.push(output);
});

client.messages.on('released', (text, player, nodes) => {
  const joinedMessage = nodesToText(nodes)
  messages.value.push(joinedMessage);
});

client.messages.on('serverChat', (message, nodes) => {
  console.log('SERVER SENT')
  console.log(message)
  const joinedMessage = nodesToText(nodes)
  messages.value.push(joinedMessage);
});

client.messages.on('tagsUpdated', (text, player, tags, nodes) => {
  const joinedMessage = nodesToText(nodes)
  messages.value.push(joinedMessage);
});

client.messages.on('tutorial', (text, nodes) => {
  const joinedMessage = nodesToText(nodes)
  messages.value.push(`<img class="inline-img" src="${info}"><em style="color: teal;">${joinedMessage}</em>`);
});

client.messages.on('userCommand', (text, nodes) => {
  const joinedMessage = nodesToText(nodes);
  messages.value.push(`<pre style="background: #c0c0c0">${joinedMessage}</pre>`);
});

client.messages.on('chat', (message, player, nodes) => {
  let out = `<strong>${player.alias}</strong>: `;

  // Check if the text is a link
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  message = message.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });

  message = basicMarkdownToHtml(message.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
  messages.value.push(out + message);
})

function nodesToText(nodes: MessageNode[]) {
  return nodes.map(n => n.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')).join();
}

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

async function safeCall<T>(promise: Promise<T>) {
  try {
    const data = await promise;

    return {
      success: true,
      data
    };
  } catch (e: any) {
    let error: Error = e;
    let message = 'An unknown error occurred';

    if (e && e instanceof Error) message = e.message;

    return {
      success: false,
      data: null,
      error,
      message
    }
  }
}

export async function login(url: string, slot: string, password?: string) {
  const options = password ? { password } : undefined;
  return await safeCall(client.login(url, slot, undefined, options));
}