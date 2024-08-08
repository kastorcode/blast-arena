import { TILE_SIZE } from '#/constants'
import { Player } from '~/game/entities/player'

interface Collision {
  x : number
  y : number
}

export function isColliding (p : Player, o : Collision) : boolean {
  return p.x + 15 > o.x && p.x < o.x + TILE_SIZE &&
         p.y + 23 > o.y && p.y + 7 < o.y + TILE_SIZE
}