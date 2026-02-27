import { client, ItemClass } from './archipelago';

export function getPlayerStyles(slot: number) {
  const isMe = slot === client.players.self.slot;

  return {
    color: isMe ? 'var(--theme-player-you)' : 'var(--theme-player-other)'
  };
}

export function getItemStyles(itemClass: ItemClass) {
  switch (itemClass) {
    case ItemClass.PROGRESSION:
      return { color: 'var(--theme-item-progression)' };
    case ItemClass.USEFUL:
      return { color: 'var(--theme-item-useful)' };
    case ItemClass.TRAP:
      return { color: 'var(--theme-item-trap)' };
    default:
      return { color: 'var(--theme-item-normal)' };
  }
}