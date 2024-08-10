export interface Animation {
  ANIM_INTERVAL : number
  COLUMN        : number
  FRAME_START   : number
  FRAME_END     : number
  FRAME_WIDTH   : number
  FRAME_HEIGHT  : number
}

export interface AnimController {
  anim : {
    frameCurrent : number
    lastRender   : number
    sum          : boolean
  }
}

export function animate (o : AnimController, D : Animation) {
  const currentTime = Date.now()
  if (currentTime - o.anim.lastRender > D.ANIM_INTERVAL) {
    if (o.anim.frameCurrent === D.FRAME_END) {
      o.anim.sum = false
    }
    else if (o.anim.frameCurrent === D.FRAME_START) {
      o.anim.sum = true
    }
    o.anim.sum ? o.anim.frameCurrent++ : o.anim.frameCurrent--
    o.anim.lastRender = currentTime
  }
  return {
    sx: o.anim.frameCurrent * D.FRAME_WIDTH,
    sy: D.COLUMN * D.FRAME_HEIGHT
  }
}