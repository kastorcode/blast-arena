import { Animation } from './animation'

const AnimationBase = {
  ANIM_INTERVAL: 100,
  FRAME_WIDTH  : 15,
  FRAME_HEIGHT : 23
}

export const PLAYER_U : Animation = {
  ...AnimationBase,
  ROW        : 1,
  FRAME_START: 0,
  FRAME_END  : 2
}

export const PLAYER_UH : Animation = {
  ...AnimationBase,
  ROW        : 1,
  FRAME_START: 3,
  FRAME_END  : 5
}

export const PLAYER_L : Animation = {
  ...AnimationBase,
  ROW        : 3,
  FRAME_START: 0,
  FRAME_END  : 2
}

export const PLAYER_LH : Animation = {
  ...AnimationBase,
  ROW        : 3,
  FRAME_START: 3,
  FRAME_END  : 5
}

export const PLAYER_D : Animation = {
  ...AnimationBase,
  ROW        : 0,
  FRAME_START: 0,
  FRAME_END  : 2
}

export const PLAYER_DH : Animation = {
  ...AnimationBase,
  ROW        : 0,
  FRAME_START: 3,
  FRAME_END  : 5
}

export const PLAYER_R : Animation = {
  ...AnimationBase,
  ROW        : 2,
  FRAME_START: 0,
  FRAME_END  : 2
}

export const PLAYER_RH : Animation = {
  ...AnimationBase,
  ROW        : 2,
  FRAME_START: 3,
  FRAME_END  : 5
}

export const PLAYER_K : Animation = {
  ...AnimationBase,
  ANIM_INTERVAL: 50,
  ROW          : 4,
  FRAME_START  : 0,
  FRAME_END    : 7
}