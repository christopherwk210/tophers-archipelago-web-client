import type { JSONRecord } from 'archipelago.js';
import { client } from './archipelago';
import { jsConfetti } from './confetti';
import { chat } from '@/state/chat';

interface TAWCBounce<T extends JSONRecord = JSONRecord> {
  signal: string;
  data: T;
  handler: (data: T) => void;
}

export const tawcBounces = [
  {
    signal: 'confetti',
    data: {
      slot: 0 as number
    },
    handler(data) {
      const { slot } = data;
      if (typeof slot !== 'number') return;
      const foundPlayer = client.players.findPlayer(slot);
      if (!foundPlayer) return;

      chat.messages.push({
        type: 'confetti',
        player: foundPlayer.alias,
        slot: foundPlayer.slot,
        game: foundPlayer.game
      });
      
      jsConfetti.addConfetti();
    }
  }
] as const satisfies ReadonlyArray<TAWCBounce>;

type TAWCBounceMap = typeof tawcBounces[number];
type TAWCSignal = TAWCBounceMap['signal'];
type TAWCDataFor<S extends TAWCSignal> = Extract<TAWCBounceMap, { signal: S }>['data'];

export function tawcBounce<S extends TAWCSignal>(signal: S, data: TAWCDataFor<S>) {
  client.bounce({ games: [], slots: [], tags: ['TextOnly'] }, { __twac: true, __signal: signal, data });
}