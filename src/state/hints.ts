import { client, getItemClass, ItemClass } from '@/lib/archipelago';
import { reactive, ref } from 'vue';
import { showMouseToast } from './ui';
import { settings } from './settings';
import { useLocalization } from '@/lib/localization-util';

export enum HintStatus {
  UNSPECIFIED = 0,
  NO_PRIORITY = 10,
  AVOID = 20,
  PRIORITY = 30,
  FOUND = 40
}

export interface LocalHint {
  item: string;
  itemClass: ItemClass[];
  found: boolean;
  player: string;
  slot: number;
  game: string;
  location: string;
  locationId: number;
  owner: string;
  ownerSlot: number;
  ownerGame: string;
  status: HintStatus;
}

export const hints = reactive({
  cost: 0,
  points: 0,
  list: [] as LocalHint[]
});

export function getCssVarFromStatus(status: HintStatus) {
  switch (status) {
    case HintStatus.PRIORITY:
      return 'var(--theme-status-priority)';
    case HintStatus.UNSPECIFIED:
      return 'var(--theme-status-none)';
    case HintStatus.FOUND:
      return 'var(--theme-status-found)';
    case HintStatus.AVOID:
      return 'var(--theme-status-avoid)';
    case HintStatus.NO_PRIORITY:
      return 'var(--theme-status-no-priority)';
  }
}

export function getHintStatusName(status: HintStatus) {
  const { t } = useLocalization();

  switch (status) {
    case HintStatus.PRIORITY:
      return t('Texts.textPriority');
    case HintStatus.UNSPECIFIED:
      return t('Texts.textUnspecified');
    case HintStatus.FOUND:
      return t('Texts.textFound');
    case HintStatus.AVOID:
      return t('Texts.textAvoid');
    case HintStatus.NO_PRIORITY:
      return t('Texts.textNoPriority');
  }
}

export const hintsLastUpdated = ref(0);

export async function loadHints() {
  hints.cost = client.room.hintCost;
  hints.points = client.room.hintPoints;

  const list = await client.players.self.fetchHints().catch(() => []);
  
  hints.list = list.map(hint => {
    const validStatus = !!HintStatus[(hint as any).status];

    return {
      item: hint.item.name,
      itemClass: getItemClass(hint.item),
      found: hint.found,
      player: hint.item.receiver.alias,
      slot: hint.item.receiver.slot,
      game: hint.item.receiver.game,
      location: hint.item.locationName,
      locationId: hint.item.locationId,
      owner: hint.item.sender.alias,
      ownerSlot: hint.item.sender.slot,
      ownerGame: hint.item.sender.game,
      status: validStatus ? (hint as any).status : HintStatus.UNSPECIFIED
    };
  });

  hintsLastUpdated.value = Date.now();
}

export async function copyHint(item: LocalHint) {
  const { t } = useLocalization();

  // showMouseToast(t('Hints.hintCopied'));

  const trueItemPlayer = item.player.replace('&lt;', '<').replace('&gt;', '>');
  const trueItemOwner = item.owner.replace('&lt;', '<').replace('&gt;', '>');

  let result: boolean | void;
  switch (settings.value.hintCopyType) {
    case 'markdown':
      result = await navigator.clipboard.writeText(t('Hints.hintCopyMarkdown', {
        owner: trueItemPlayer,
        item: item.item,
        player: trueItemOwner,
        location: item.location
      })).catch(() => false);
      break;
    case 'plain':
      result = await navigator.clipboard.writeText(t('Hints.hintCopyBasic', {
        owner: trueItemPlayer,
        item: item.item,
        player: trueItemOwner,
        location: item.location
      })).catch(() => false);
      break;
    case 'item-name':
      result = await navigator.clipboard.writeText(item.item).catch(() => false);
      break;
    case 'ascii':
      result = await navigator.clipboard.writeText(t('Hints.hintCopyScream', {
        player: trueItemOwner.toUpperCase(),
        item: item.item.toUpperCase()
      })).catch(() => false);
      break;
  }

  if (result === false) {
    showMouseToast(t('Hints.hintCopyFailed'));
  } else {
    showMouseToast(t('Hints.hintCopied'));
  }
}