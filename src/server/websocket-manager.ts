import { Packets } from './packets';

enum WebsocketManagerState {
  CONNECTING,
  CONNECTED,
  DISCONNECTED,
  DESTROYED
}

export class WebsocketManager {
  private readonly url = 'wss://topheranselmo.com/api/tawc/ws';
  private ws: WebSocket | null = null;
  private state = WebsocketManagerState.DISCONNECTED;

  private readonly reconnectInterval = 4000;
  private reconnectTimeout: number | null = null;

  private messageHandlers: ((ws: WebSocket, packetPretty: Packets.PacketPretty) => void | false)[] = [];

  constructor(readonly playerSlot: string, readonly playerUrl: string) {
    this.connect();
  }

  private connect() {
    if (this.state === WebsocketManagerState.DESTROYED) return;

    this.state = WebsocketManagerState.CONNECTING;
    this.ws = new WebSocket(this.url);

    this.ws.addEventListener('open', () => this.state = WebsocketManagerState.CONNECTED);
    this.ws.addEventListener('error', () => this.ws?.close());
    this.ws.addEventListener('close', () => {
      this.ws = null;

      if (this.state === WebsocketManagerState.DESTROYED) return;
      this.state = WebsocketManagerState.DISCONNECTED;

      this.reconnectTimeout = window.setTimeout(() => this.connect(), this.reconnectInterval);
    });

    this.ws.addEventListener('message', (event: MessageEvent) => {
      const packet = JSON.parse(event.data) as Packets.Packet;
      const packetPretty = Packets.prettify(packet);
      if (this.playerUrl !== packetPretty.playerURL || this.playerSlot === packetPretty.playerSlot) return;

      for (const handler of this.messageHandlers) {
        const result = handler(this.ws!, packetPretty);
        if (result === false) break;
      }
    });
  }

  send(channel: string, data: object) {
    if (!this.ws) return false;
    if (this.ws.readyState !== WebSocket.OPEN) return false;

    const payload = Packets.unprettify({
      channel,
      data,
      playerSlot: this.playerSlot,
      playerURL: this.playerUrl
    });

    this.ws.send(JSON.stringify(payload));
  }

  addMessageHandler(handler: (ws: WebSocket, packetPretty: Packets.PacketPretty) => void | false) {
    this.messageHandlers.push(handler);
  }

  destroy() {
    this.state = WebsocketManagerState.DESTROYED;

    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.messageHandlers = [];

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}