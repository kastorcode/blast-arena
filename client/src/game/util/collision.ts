import { TILE_SIZE } from '#/constants'
import { Player } from '~/game/entities/player'

interface Collision {
  x : number
  y : number
}

export function isColliding (p:Player, o:Collision) : boolean {
  return p.x + 15 > o.x && p.x < o.x + TILE_SIZE &&
         p.y + 23 > o.y && p.y + 7 < o.y + TILE_SIZE
}

export function stopPlayer (p:Player, o:Collision) {
  p.moving = 0
  playerCollisions[p.side](p, o)
}

const playerCollisions = {
  U: collidedDown,
  D: collidedUp,
  L: collidedRight,
  R: collidedLeft
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
  p.x = o.x + 17
}