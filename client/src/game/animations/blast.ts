import { Animation } from './animation'

const AnimationBase = {
  ANIM_INTERVAL: 100,
  FRAME_START  : 0,
  FRAME_END    : 3,
  FRAME_WIDTH  : 16,
  FRAME_HEIGHT : 16
}

export const BLAST_V : Animation = {
  ...AnimationBase,
  ROW: 0
}

export const BLAST_U : Animation = {
  ...AnimationBase,
  ROW: 1
}

export const BLAST_D : Animation = {
  ...AnimationBase,
  ROW: 2
}

export const BLAST_H : Animation = {
  ...AnimationBase,
  ROW: 3
}

export const BLAST_R : Animation = {
  ...AnimationBase,
  ROW: 4
}

export const BLAST_L : Animation = {
  ...AnimationBase,
  ROW: 5
}

export const BLAST_C : Animation = {
  ...AnimationBase,
  ROW: 6
}