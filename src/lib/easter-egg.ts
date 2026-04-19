import Konami from 'konami';
import { jsConfetti } from './confetti';

let konami: any;

export function initKonami() {
  konami = new Konami(() => {
    jsConfetti.addConfetti({
      emojis: ['💀', '☠️'],
      confettiNumber: 2,
      emojiSize: 128
    });
  });
}

export function uninitKonami() {
  if (konami) konami.unload();
}