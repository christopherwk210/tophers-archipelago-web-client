import { chat, commandHints } from '@/state/chat';
import { tawcBounce } from './bounces';
import { client } from './archipelago';
import { ref } from 'vue';

class CustomCommand {
  private cmd: string = '';
  private help: string = '';
  private automaticChatHandling: boolean = true;
  private callback: (message?: string) => any = () => {};

  private constructor() {}

  static create(cmd: string) {
    const instance = new CustomCommand();
    instance.cmd = cmd;
    return instance;
  }

  setHelp(help: string) {
    this.help = help;
    return this;
  }

  setAutomaticChatHandling(automaticChatHandling: boolean) {
    this.automaticChatHandling = automaticChatHandling;
    return this;
  }

  setCallback(callback: (message?: string) => any) {
    this.callback = callback;
    return this;
  }

  build() {
    const callback = this.automaticChatHandling ? (message?: string) => {
      chat.say = '';
      chat.lastSay = this.cmd;
      this.callback(message);
    } : this.callback;

    // Make the command recognizable by the chat handler
    chat.customCommands[this.cmd] = callback;

    // Add this command to the command hints
    commandHints.value.push({
      cmd: this.cmd,
      args: [],
      help: this.help,
      isCustom: true
    });
  }
}

const lastConfettiSendTimestamp = ref(new Date(0));
const confettiCooldown = 1000;

export function initializeCustomCommands() {
  chat.customCommands = {};
  commandHints.value = commandHints.value.filter(hint => !hint.isCustom);

  CustomCommand
    .create('/clear')
    .setHelp('Clears the local chat history.')
    .setCallback(() => chat.messages = [])
    .build();

  CustomCommand
    .create('/confetti')
    .setHelp('Triggers a confetti celebration for everyone using Topher\'s Archipelago Web Client, including you!')
    .setCallback(() => {
      const now = new Date();

      if (now.getTime() - lastConfettiSendTimestamp.value.getTime() < confettiCooldown) {
        chat.messages.push({
          type: 'none',
          content: `<em>No spamming the confetti!</em>`
        });
        return;
      }

      lastConfettiSendTimestamp.value = now;
      tawcBounce('confetti', { slot: client.players.self.slot });
    })
    .build();
  
  CustomCommand
    .create('/shrug')
    .setHelp('Expands to ¯\\_(ツ)_/¯')
    .setCallback(() => {
      chat.say = `¯\\_(ツ)_/¯`;
    })
    .build();
  
  CustomCommand
    .create('/tableflip')
    .setHelp('Expands to (╯°□°)╯︵ ┻━┻')
    .setCallback(() => {
      chat.say = `(╯°□°)╯︵ ┻━┻`;
    })
    .build();

  CustomCommand
    .create('/unflip')
    .setHelp('Expands to ┬─┬ノ( º _ ºノ)')
    .setCallback(() => {
      chat.say = `┬─┬ノ( º _ ºノ)`;
    })
    .build();
}