import { settings } from '@/state/settings';
import type { WebsocketManager } from './websocket-manager';

export class LocalCursorManager {
  private lastMouseEvent: MouseEvent | null = null;
  private intervalId: number | null = null;
  private readonly updateRate = 1000 / 30;

  private cursorOnPage = true;
  private onMouseEnter = () => { this.cursorOnPage = true; };
  private onMouseLeave = () => { this.cursorOnPage = false; };

  private onMouseMove = (e: MouseEvent) => { this.lastMouseEvent = e; };

  constructor(private websocketManager: WebsocketManager) {
    window.addEventListener('mousemove', this.onMouseMove);
    document.documentElement.addEventListener('mouseenter', this.onMouseEnter);
    document.documentElement.addEventListener('mouseleave', this.onMouseLeave);

    this.intervalId = window.setInterval(() => {
      if (!this.lastMouseEvent) return;

      this.websocketManager.send('cursor', {
        x: this.lastMouseEvent.clientX,
        y: this.lastMouseEvent.clientY,
        c: settings.value.serverCursorsColor,
        i: (this.cursorOnPage && settings.value.serverCursorsEnable) ? settings.value.serverCursorsImage : ''
      });
    }, this.updateRate);
  }

  destroy() {
    window.removeEventListener('mousemove', this.onMouseMove);
    document.documentElement.removeEventListener('mouseenter', this.onMouseEnter);
    document.documentElement.removeEventListener('mouseleave', this.onMouseLeave);

    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.lastMouseEvent = null;
  }
}