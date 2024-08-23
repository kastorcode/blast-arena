export interface Animation {
  ANIM_INTERVAL : number
  ROW           : number
  FRAME_START   : number
  FRAME_END     : number
  FRAME_WIDTH   : number
  FRAME_HEIGHT  : number
}

export interface AnimControl {
  anim : {
    frameCurrent : number
    lastRender   : number
    sum          : boolean
  }
}

export function animate (o:AnimControl, A:Animation) {
  const currentTime = Date.now()
  if (currentTime - o.anim.lastRender > A.ANIM_INTERVAL) {
    if (o.anim.frameCurrent >= A.FRAME_END) {
      o.anim.sum = false
    }
    else if (o.anim.frameCurrent <= A.FRAME_START) {
      o.anim.sum = true
    }
    o.anim.sum ? o.anim.frameCurrent++ : o.anim.frameCurrent--
    o.anim.lastRender = currentTime
  }
  return {
    sx: o.anim.frameCurrent * A.FRAME_WIDTH,
    sy: A.ROW * A.FRAME_HEIGHT
  }
}