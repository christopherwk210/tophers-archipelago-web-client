import Dexie, { type EntityTable } from 'dexie';
import { client, ItemClass, sortItemClasses } from './archipelago';
import { ref } from 'vue';

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

const databaseName = 'tophers-archipelago-web-client-css';

// The structure of the "package" table entity
interface CSSPackage {
  css: string;
}

export const db = new Dexie(databaseName) as Dexie & {
  packages: EntityTable<CSSPackage>
};

// Database configuration
db.version(1).stores({
  packages: 'css'
});

export async function getCustomCSS() {
  const packages = await db.packages.toArray();
  if (packages && packages.length > 0 && packages[0]) {
    return packages[0].css || '';
  } else {
    return '';
  }
}

export async function setCustomCSS(css: string) {
  db.packages.clear();
  await db.packages.put({ css });
}

export const customCSS = ref('');