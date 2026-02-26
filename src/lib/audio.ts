import { Howl } from 'howler';
import CHIMES from '@/assets/audio/CHIMES.mp3';
import NOTIFY from '@/assets/audio/NOTIFY.mp3';

const sounds = {
  chimes: new Howl({
    src: [CHIMES],
    preload: true
  }),
  notify: new Howl({
    src: [NOTIFY],
    preload: true
  })
} as const satisfies Record<string, Howl>;

export function playSound(name: keyof typeof sounds) {
  const sound = sounds[name];
  if (sound.playing()) sound.stop();
  sound.play();
}