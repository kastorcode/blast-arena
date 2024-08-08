import { TILE_SIZE } from '#/constants'
import { isColliding } from '~/game/util/collision'
import { Player } from './player'

export interface Block {
  x : number
  y : number
  tick : (p : Player) => boolean
}

export function BlocksFactory () : Block[] {
  const blocks:Block[] = []
  for (let x = 32; x < 193; x += 32) {
    for (let y = 32; y < 161; y += 32) {
      // @ts-expect-error
      const block : Block = { x, y }
      block.tick = tick.bind(block)
      blocks.push(block)
    }
  }
  return blocks
}

function tick (this : Block, p : Player) : boolean {
  const TOLERANCE = 6
  const colliding = isColliding(p, this)
  if (colliding) {
    if (p.x + 15 > this.x && p.side === 'R') {
      p.x = this.x - 15
      if (p.y + 23 - this.y <= TOLERANCE) {
        p.y -= p.speed
        p.x += p.speed
      }
      else if (p.y - this.y >= 4) {
        p.y += p.speed
        p.x += p.speed
      }
      else p.moving = 0
    }
    else if (p.x < this.x + TILE_SIZE && p.side === 'L') {
      p.x = this.x + 17
      if (p.y + 23 - this.y <= TOLERANCE) {
        p.y -= p.speed
        p.x -= p.speed
      }
      else if (p.y - this.y >= 4) {
        p.y += p.speed
        p.x -= p.speed
      }
      else p.moving = 0
    }
    else if (p.y + 23 > this.y && p.side === 'D') {
      p.y = this.y - 23
      if (p.x + 15 - this.x <= TOLERANCE) {
        p.x -= p.speed
        p.y += p.speed
      }
      else if (this.x + TILE_SIZE - p.x <= TOLERANCE) {
        p.x += p.speed
        p.y += p.speed
      }
      else p.moving = 0
    }
    else {
      p.y = this.y + 9
      if (p.x + 15 - this.x <= TOLERANCE) {
        p.x -= p.speed
        p.y -= p.speed
      }
      else if (this.x + TILE_SIZE - p.x <= TOLERANCE) {
        p.x += p.speed
        p.y -= p.speed
      }
      else p.moving = 0
    }
  }
  return colliding
}