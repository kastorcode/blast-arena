import { TILE_SIZE } from '#/constants'
import { Player } from '~/game/entities/player'
import { emitMove } from '~/services/socket'

interface Collision {
  x : number
  y : number
}

export function isColliding (p:Player, o:Collision) : boolean {
  if (p.collidable) return isCollidingForced(p, o)
  return false
}

export function isCollidingForced (p:Player, o:Collision) : boolean {
  return p.x + 15 > o.x && p.x < o.x + TILE_SIZE &&
         p.y + 23 > o.y && p.y + 7 < o.y + TILE_SIZE
}

export function stopPlayer (p:Player, o:Collision) {
  p.moving = 0
  playerCollisions[collisionSide(p, o)](p, o)
  emitMove({h:p.holding, m:p.moving, p:p.index, s:p.side, x:p.x, y:p.y})
}

const playerCollisions = {
  U: collidedDown,
  D: collidedUp,
  L: collidedRight,
  R: collidedLeft
}

export function collisionSide (p:Player, o:Collision) {
  const deltaX = (p.x + 8) - (o.x + 8)
  const deltaY = (p.y + 7) - o.y
  const absDeltaX = Math.abs(deltaX)
  const absDeltaY = Math.abs(deltaY)
  if (absDeltaX > absDeltaY) {
    if (deltaX > 0) return 'L'
    return 'R'
  }
  else {
    if (deltaY > 0) return 'U'
    return 'D'
  }
}

function collidedUp (p:Player, o:Collision) {
  p.y = o.y - 23
}

function collidedDown (p:Player, o:Collision) {
  p.y = o.y + 9
}

function collidedLeft (p:Player, o:Collision) {
  p.x = o.x - 15
}

function collidedRight (p:Player, o:Collision) {
  p.x = o.x + 16
}