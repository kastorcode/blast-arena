import { Animation } from './animation'

export const AnimationBase = {
  ANIM_INTERVAL: 125
}

export const PLAYER_U : Animation = {
  ...AnimationBase,
  COLUMN      : 1,
  FRAME_START : 0,
  FRAME_END   : 2,
  FRAME_WIDTH : 15,
  FRAME_HEIGHT: 23
}

export const PLAYER_UH : Animation = {
  ...AnimationBase,
  COLUMN      : 1,
  FRAME_START : 3,
  FRAME_END   : 5,
  FRAME_WIDTH : 15,
  FRAME_HEIGHT: 23
}

export const PLAYER_L : Animation = {
  ...AnimationBase,
  COLUMN      : 3,
  FRAME_START : 0,
  FRAME_END   : 2,
  FRAME_WIDTH : 15,
  FRAME_HEIGHT: 23
}

export const PLAYER_LH : Animation = {
  ...AnimationBase,
  COLUMN      : 3,
  FRAME_START : 3,
  FRAME_END   : 5,
  FRAME_WIDTH : 15,
  FRAME_HEIGHT: 23
}

export const PLAYER_D : Animation = {
  ...AnimationBase,
  COLUMN      : 0,
  FRAME_START : 0,
  FRAME_END   : 2,
  FRAME_WIDTH : 15,
  FRAME_HEIGHT: 23
}

export const PLAYER_DH : Animation = {
  ...AnimationBase,
  COLUMN      : 0,
  FRAME_START : 3,
  FRAME_END   : 5,
  FRAME_WIDTH : 15,
  FRAME_HEIGHT: 23
}

export const PLAYER_R : Animation = {
  ...AnimationBase,
  COLUMN      : 2,
  FRAME_START : 0,
  FRAME_END   : 2,
  FRAME_WIDTH : 15,
  FRAME_HEIGHT: 23
}

export const PLAYER_RH : Animation = {
  ...AnimationBase,
  COLUMN      : 2,
  FRAME_START : 3,
  FRAME_END   : 5,
  FRAME_WIDTH : 15,
  FRAME_HEIGHT: 23
}