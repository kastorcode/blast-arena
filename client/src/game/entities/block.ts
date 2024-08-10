import { TILE_SIZE } from '#/constants'
import { BlockDTO, SIDES } from '#/dto'
import { Stage } from '~/game/entities/stage'
import { GameState } from '~/game/entities/state'
import { isColliding } from '~/game/util/collision'
import { Player } from './player'
import TILE_IMG from '../components/tileImg'

interface Block extends BlockDTO {
  sides   : {[key in SIDES] : (p:Player) => void}
  tick    : (player:Player) => boolean
  render  : (context:CanvasRenderingContext2D, stage:Stage) => void
}

export interface Blocks {
  blocks : (Block|null)[][]
  tick   : (player:Player) => void
  render : (context:CanvasRenderingContext2D, stage:Stage) => void
}

export function BlocksFactory (blocksDto : (BlockDTO|null)[][]) : Blocks {
  const blocks = blocksDto.map(row => row.map(dto => {
    if (!dto) return null
    const block:Block = dto as Block
    if (block.t === 'D') {
      block.tick = tickD.bind(block)
      block.render = renderD.bind(block)
    }
    else {
      block.tick = tickI.bind(block)
      block.render = renderI.bind(block)
    }
    block.sides = {
      U: collidedDown.bind(block),
      D: collidedUp.bind(block),
      L: collidedRight.bind(block),
      R: collidedLeft.bind(block)
    }
    return block
  }))
  const tick = tickPlayer.bind(blocks)
  const render = renderBlocks.bind(blocks)
  return { blocks, tick, render }
}

function collidedUp (this:Block, p:Player) {
  p.y = this.y - 23
}

function collidedDown (this:Block, p:Player) {
  p.y = this.y + 9
}

function collidedLeft (this:Block, p:Player) {
  p.x = this.x - 15
}

function collidedRight (this:Block, p:Player) {
  p.x = this.x + 17
}

function tickD (this:Block, player:Player) : boolean {
  const colliding = isColliding(player, this)
  if (colliding) {
    player.moving = 0
    this.sides[player.side](player)
  }
  return colliding
}

function tickI (this:Block, p:Player) : boolean {
  const TOLERANCE = 7
  const colliding = isColliding(p, this)
  if (colliding) {
    if (p.x + 15 > this.x && p.side === 'R') {
      p.x = this.x - 15
      if (p.y + 23 - this.y <= TOLERANCE) {
        p.y -= p.speed
        p.x += p.speed
      }
      else if (p.y - this.y >= 3) {
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
      else if (p.y - this.y >= 3) {
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

function tickPlayer (this:Blocks['blocks'], player:Player) {
  const [x, y] = player.getAxes()
  let i = x - 1
  let j = y
  if (i < 0) i = 0
  this[i][j] && this[i][j]?.tick(player)
  j = y + 1
  this[i][j] && this[i][j]?.tick(player)
  i = x
  this[i][j] && this[i][j]?.tick(player)
  i = x + 1
  if (i > 10) i = 10
  this[i][j] && this[i][j]?.tick(player)
  j = y
  this[i][j] && this[i][j]?.tick(player)
  j = y - 1
  this[i][j] && this[i][j]?.tick(player)
  i = x
  this[i][j] && this[i][j]?.tick(player)
  i = x - 1
  if (i < 0) i = 0
  this[i][j] && this[i][j]?.tick(player)
}

function renderD (this:Block, context:CanvasRenderingContext2D, stage:Stage) {
  context.drawImage(stage.bg, 0, 208, 16, 16, this.x, this.y, 16, 16)
}

function renderI (this:Block, context:CanvasRenderingContext2D, stage:Stage) {
  context.drawImage(TILE_IMG, 0, 0, 16, 16, this.x, this.y, 16, 16)
}

function renderBlocks (this:Blocks['blocks'], context:CanvasRenderingContext2D, stage:Stage) {
  this.forEach(row => row.forEach(b => b && b.render(context, stage)))
}