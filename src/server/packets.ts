export namespace Packets {
  export interface Packet {
    c: string;
    ps: string;
    pu: string;
    d: object;
  }

  export interface PacketPretty {
    channel: string;
    playerSlot: string;
    playerURL: string;
    data: object;
  }

  export function prettify(data: Packet): PacketPretty {
    return {
      channel: data.c,
      playerSlot: data.ps,
      playerURL: data.pu,
      data: data.d,
    };
  }

  export function unprettify(data: PacketPretty): Packet {
    return {
      c: data.channel,
      ps: data.playerSlot,
      pu: data.playerURL,
      d: data.data,
    };
  }
}