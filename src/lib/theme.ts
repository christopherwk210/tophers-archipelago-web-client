import { client, ItemClass, sortItemClasses } from './archipelago';

export function getPlayerStyles(slot: number) {
  const isMe = slot === client.players.self.slot;

  return {
    color: isMe ? 'var(--theme-player-you)' : 'var(--theme-player-other)'
  };
}

export function getItemStyles(itemClass: ItemClass[]) {
  const sorted = sortItemClasses(itemClass);

  const classColors: Record<ItemClass, string> = {
    [ItemClass.PROGRESSION]: 'var(--theme-item-progression)',
    [ItemClass.USEFUL]: 'var(--theme-item-useful)',
    [ItemClass.TRAP]: 'var(--theme-item-trap)',
    [ItemClass.NORMAL]: 'var(--theme-item-normal)'
  };

  if (sorted.length === 0) return {};
  if (sorted.length === 1) {
    const iclass = sorted[0]!;
    return {
      color: classColors[iclass]
    };
  }

  const gradientColors = sorted.map(iclass => classColors[iclass]).join(', ');
  return {
    background: `linear-gradient(to right, ${gradientColors})`,
    'background-clip': 'text',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent'
  };
}
