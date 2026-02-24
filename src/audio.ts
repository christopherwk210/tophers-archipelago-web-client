import { Howl } from 'howler';
import CHIMES from '@/assets/audio/CHIMES.mp3';
import NOTIFY from '@/assets/audio/NOTIFY.mp3';

export const sounds = {
  chimes: new Howl({ src: [CHIMES] }),
  notify: new Howl({ src: [NOTIFY] })
};