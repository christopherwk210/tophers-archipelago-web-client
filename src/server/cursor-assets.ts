import { defineComponent, h, compile, ref } from 'vue';

import dot_large from '@/assets/cursors/dot_large.svg';
import hand_point from '@/assets/cursors/hand_point.svg';
import line_cross from '@/assets/cursors/line_cross.svg';
import mark_exclamation_pointer_b from '@/assets/cursors/mark_exclamation_pointer_b.svg';
import navigation_nw from '@/assets/cursors/navigation_nw.svg';
import pointer_a from '@/assets/cursors/pointer_a.svg';
import pointer_b from '@/assets/cursors/pointer_b.svg';
import pointer_e from '@/assets/cursors/pointer_e.svg';
import pointer_f from '@/assets/cursors/pointer_f.svg';
import pointer_k from '@/assets/cursors/pointer_k.svg';
import pointer_scifi_a from '@/assets/cursors/pointer_scifi_a.svg';
import target_round_b from '@/assets/cursors/target_round_b.svg';
import tool_bow from '@/assets/cursors/tool_bow.svg';
import tool_sword_a from '@/assets/cursors/tool_sword_a.svg';
import tool_sword_b from '@/assets/cursors/tool_sword_b.svg';
import tool_wrench from '@/assets/cursors/tool_wrench.svg';

import dot_large_raw from '@/assets/cursors/dot_large.svg?raw';
import hand_point_raw from '@/assets/cursors/hand_point.svg?raw';
import line_cross_raw from '@/assets/cursors/line_cross.svg?raw';
import mark_exclamation_pointer_b_raw from '@/assets/cursors/mark_exclamation_pointer_b.svg?raw';
import navigation_nw_raw from '@/assets/cursors/navigation_nw.svg?raw';
import pointer_a_raw from '@/assets/cursors/pointer_a.svg?raw';
import pointer_b_raw from '@/assets/cursors/pointer_b.svg?raw';
import pointer_e_raw from '@/assets/cursors/pointer_e.svg?raw';
import pointer_f_raw from '@/assets/cursors/pointer_f.svg?raw';
import pointer_k_raw from '@/assets/cursors/pointer_k.svg?raw';
import pointer_scifi_a_raw from '@/assets/cursors/pointer_scifi_a.svg?raw';
import target_round_b_raw from '@/assets/cursors/target_round_b.svg?raw';
import tool_bow_raw from '@/assets/cursors/tool_bow.svg?raw';
import tool_sword_a_raw from '@/assets/cursors/tool_sword_a.svg?raw';
import tool_sword_b_raw from '@/assets/cursors/tool_sword_b.svg?raw';
import tool_wrench_raw from '@/assets/cursors/tool_wrench.svg?raw';

export const cursorSvgId = ref(0);

const images = {
  dot_large,
  hand_point,
  line_cross,
  mark_exclamation_pointer_b,
  navigation_nw,
  pointer_a,
  pointer_b,
  pointer_e,
  pointer_f,
  pointer_k,
  pointer_scifi_a,
  target_round_b,
  tool_bow,
  tool_sword_a,
  tool_sword_b,
  tool_wrench,
} as const;

export type CursorImage = keyof typeof images;

export interface CursorAsset {
  asset_raw: string;
  image: any;
  offset: { x: number; y: number; };
}

export const cursorAssets: Record<CursorImage, CursorAsset> = {
  dot_large: {
    asset_raw: dot_large_raw,
    image: dot_large,
    offset: { x: -15, y: -15 }
  },
  hand_point: {
    asset_raw: hand_point_raw,
    image: hand_point,
    offset: { x: -8, y: -4 }
  },
  line_cross: {
    asset_raw: line_cross_raw,
    image: line_cross,
    offset: { x: -16, y: -16 }
  },
  mark_exclamation_pointer_b: {
    asset_raw: mark_exclamation_pointer_b_raw,
    image: mark_exclamation_pointer_b,
    offset: { x: -9, y: -2 }
  },
  navigation_nw: {
    asset_raw: navigation_nw_raw,
    image: navigation_nw,
    offset: { x: -9, y: -9 }
  },
  pointer_a: {
    asset_raw: pointer_a_raw,
    image: pointer_a,
    offset: { x: -11, y: -8 }
  },
  pointer_b: {
    asset_raw: pointer_b_raw,
    image: pointer_b,
    offset: { x: -11, y: -8 }
  },
  pointer_e: {
    asset_raw: pointer_e_raw,
    image: pointer_e,
    offset: { x: -9, y: -9 }
  },
  pointer_f: {
    asset_raw: pointer_f_raw,
    image: pointer_f,
    offset: { x: -9, y: -9 }
  },
  pointer_k: {
    asset_raw: pointer_k_raw,
    image: pointer_k,
    offset: { x: -9, y: -9 }
  },
  pointer_scifi_a: {
    asset_raw: pointer_scifi_a_raw,
    image: pointer_scifi_a,
    offset: { x: -6, y: -6 }
  },
  target_round_b: {
    asset_raw: target_round_b_raw,
    image: target_round_b,
    offset: { x: -16, y: -16 }
  },
  tool_bow: {
    asset_raw: tool_bow_raw,
    image: tool_bow,
    offset: { x: -6, y: -6 }
  },
  tool_sword_a: {
    asset_raw: tool_sword_a_raw,
    image: tool_sword_a,
    offset: { x: -5, y: -5 }
  },
  tool_sword_b: {
    asset_raw: tool_sword_b_raw,
    image: tool_sword_b,
    offset: { x: -5, y: -5 }
  },
  tool_wrench: {
    asset_raw: tool_wrench_raw,
    image: tool_wrench,
    offset: { x: -8, y: -8 }
  },
};