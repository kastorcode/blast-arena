import { TILE_SIZE } from '#/constants'
import { BlockDTO, SIDES } from '#/dto'
import { animate, AnimControl } from '~/game/animations/animation'
import { BLOCK } from '~/game/animations/block'
import { GameState } from '~/game/entities/state'
import { isColliding } from '~/game/util/collision'
import { Player } from './player'
import TILE_IMG from '../components/tileImg'

interface Block extends BlockDTO {
  anim        : AnimControl['anim']
  axes        : [number, number]
  destroying  : boolean
  destroyTime : number
  sides       : {[key in SIDES] : (p:Player) => void}
  destroy : () => void
  tick    : (player:Player) => boolean
  render  : (context:CanvasRenderingContext2D, state:GameState) => void
}

export interface Blocks {
  blocks : (Block|null)[][]
  getBlock     : (x:number, y:number) => Block|null
  destroyBlock : (axes:[number, number]) => void
  tick         : (player:Player) => void
  render       : (context:CanvasRenderingContext2D, state:GameState) => void
}

export function BlocksFactory (blocksDto : (BlockDTO|null)[][]) : Blocks {
  const blocks = blocksDto.map((row,i) => row.map((dto,j) => {
    if (!dto) return null
    const block:Block = dto as Block
    if (block.t === 'D') {
      block.anim = {frameCurrent:0, lastRender:0, sum:true}
      block.axes = [i, j]
      block.destroying = false
      block.destroy = startDestroyBlock.bind(block)
      block.tick = tickD.bind(block)
      block.render = renderAndDestroy.bind(block)
    }
    else {
      block.destroy = () => {}
      block.tick = tickI.bind(block)
      block.render = () => {}
    }
    block.sides = {
      U: collidedDown.bind(block),
      D: collidedUp.bind(block),
      L: collidedRight.bind(block),
      R: collidedLeft.bind(block)
    }
    return block
  }))
  const getBlock = getOneBlock.bind(blocks)
  const destroyBlock = nullifyBlock.bind(blocks)
  const tick = tickPlayer.bind(blocks)
  const render = renderBlocks.bind(blocks)
  return { blocks, getBlock, destroyBlock, tick, render }
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

function getOneBlock (this:Blocks['blocks'], x:number, y:number) : Block|null {
  return this[x][y]
}

function startDestroyBlock (this:Block) {
  this.destroying = true
  this.destroyTime = Date.now() + 600
  this.tick = () => false
}

function nullifyBlock (this:Blocks['blocks'], axes:[number, number]) {
  this[axes[0]][axes[1]] = null
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

function renderAndDestroy (this:Block, context:CanvasRenderingContext2D, state:GameState) {
  if (this.destroying) {
    if (Date.now() > this.destroyTime) {
      state.blocks.destroyBlock(this.axes)
    }
    else {
      const { sx, sy } = animate(this, BLOCK)
      context.drawImage(state.stage.bg, sx, sy, BLOCK.FRAME_WIDTH, BLOCK.FRAME_HEIGHT, this.x, this.y, BLOCK.FRAME_WIDTH, BLOCK.FRAME_HEIGHT)
    }
  }
  else {
    context.drawImage(state.stage.bg, 0, 208, TILE_SIZE, TILE_SIZE, this.x, this.y, TILE_SIZE, TILE_SIZE)
  }
}

function renderBlocks (this:Blocks['blocks'], context:CanvasRenderingContext2D, state:GameState) {
  this.forEach(row => row.forEach(b => b && b.render(context, state)))
}