import { WebsocketManager } from './websocket-manager';
import { CursorManager } from './cursor-manager';
import { LocalCursorManager } from './local-cursor-manager';
import { ref } from 'vue';

export class Server {
  websocketManager?: WebsocketManager;
  cursorManager = ref<CursorManager>();
  localCursorManager?: LocalCursorManager;

  mount(playerSlot: string, playerUrl: string) {
    this.websocketManager = new WebsocketManager(playerSlot, playerUrl);
    this.cursorManager.value = new CursorManager(this.websocketManager);
    this.localCursorManager = new LocalCursorManager(this.websocketManager);
  }

  unmount() {
    this.websocketManager?.destroy();
    this.cursorManager.value?.destroy();
    this.localCursorManager?.destroy();

    this.websocketManager = undefined;
    this.cursorManager.value = undefined;
    this.localCursorManager = undefined;
  }
}