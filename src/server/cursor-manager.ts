import { reactive } from 'vue';
import type { WebsocketManager } from './websocket-manager';

export type ICursor = {
  slot: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;

  meta: {
    image: string;
    color: string;
  };
};

export class CursorManager {
  cursors = reactive(new Map<string, ICursor>());

  private cursorInterpolationSpeed = 0.1;
  private animationFrameId: number | null = null;

  constructor(private websocketManager: WebsocketManager) {
    this.animationFrameId = requestAnimationFrame(this.animateCursors.bind(this));

    this.websocketManager.addMessageHandler((_ws, { channel, data, playerSlot }) => {
      switch (channel) {
        case 'cursor': this.handleCursorUpdate(playerSlot, data as any); break;
        case 'leave': this.removeCursor(playerSlot); break;
      }
    });
  }
  
  private animateCursors() {
    for (const cursor of this.cursors.values()) {
      cursor.x += (cursor.targetX - cursor.x) * this.cursorInterpolationSpeed;
      cursor.y += (cursor.targetY - cursor.y) * this.cursorInterpolationSpeed;
    }

    this.animationFrameId = requestAnimationFrame(this.animateCursors.bind(this));
  }

  private handleCursorUpdate(playerSlot: string, data: {
    x: number;
    y: number;
    c: string;
    i: string;
  }) {
    const { x: targetX, y: targetY, c: color, i: image } = data;
    const existingCursor = this.cursors.get(playerSlot);

    if (existingCursor) {
      existingCursor.targetX = targetX;
      existingCursor.targetY = targetY;
      existingCursor.meta.color = color;
      existingCursor.meta.image = image;
      return;
    }

    this.cursors.set(playerSlot, {
      slot: playerSlot,
      x: targetX,
      y: targetY,
      targetX,
      targetY,
      meta: {
        image,
        color
      }
    });
  }

  private removeCursor(playerSlot: string) {
    const cursor = this.cursors.get(playerSlot);
    if (!cursor) return;

    this.cursors.delete(playerSlot);
  }

  destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.cursors.clear();
  }
}