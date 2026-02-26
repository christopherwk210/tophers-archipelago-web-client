import { client, ItemClass } from './archipelago';

function isAliasMe(player: string) {
  return player === client.players.self.alias;
}

export function getPlayerStyles(player: string) {
  return {
    color: isAliasMe(player) ? 'var(--theme-player-you)' : 'var(--theme-player-other)'
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