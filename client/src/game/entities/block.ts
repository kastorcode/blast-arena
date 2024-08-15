import { TILE_SIZE } from '#/constants'
import { BlockDTO } from '#/dto'
import { animate, AnimControl } from '~/game/animations/animation'
import { BLOCK } from '~/game/animations/block'
import { Bonus, BonusFactory } from '~/game/entities/bonus'
import { GameState } from '~/game/entities/state'
import { isColliding, stopPlayer } from '~/game/util/collision'

interface Block extends BlockDTO {
  anim        : AnimControl['anim']
  axes        : [number, number]
  destroying  : boolean
  destroyTime : number
  destroy : () => void
  tick    : (state:GameState) => boolean
  render  : (context:CanvasRenderingContext2D, state:GameState) => void
}

export interface Blocks {
  blocks : (Block|Bonus|null)[][]
  getBlock     : (axes:[number,number]) => Block|Bonus|null
  destroyBlock : (axes:[number,number], state:GameState) => void
  tick         : (state:GameState) => void
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
    return block
  }))
  const getBlock = getOneBlock.bind(blocks)
  const destroyBlock = nullifyBlock.bind(blocks)
  const tick = tickPlayer.bind(blocks)
  const render = renderBlocks.bind(blocks)
  return { blocks, getBlock, destroyBlock, tick, render }
}

function getOneBlock (this:Blocks['blocks'], axes:[number,number]) : Block|Bonus|null {
  return this[axes[0]][axes[1]]
}

function startDestroyBlock (this:Block) {
  this.destroying = true
  this.destroyTime = Date.now() + 600
  this.tick = () => false
}

function nullifyBlock (this:Blocks['blocks'], axes:[number,number], state:GameState) {
  const block = this[axes[0]][axes[1]]
  if (block && (block as Block).b) {
    this[axes[0]][axes[1]] = BonusFactory({
      axes, bonus:(block as Block).b!, state, x:block.x, y:block.y
    })
  }
  else {
    this[axes[0]][axes[1]] = null
  }
}

function tickD (this:Block, state:GameState) : boolean {
  const colliding = isColliding(state.players.myself!, this)
  if (colliding) stopPlayer(state.players.myself!, this)
  return colliding
}

function tickI (this:Block, state:GameState) : boolean {
  const TOLERANCE = 7
  const colliding = isColliding(state.players.myself!, this)
  if (colliding) {
    const p = state.players.myself!
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

function tickPlayer (this:Blocks['blocks'], state:GameState) {
  const [x, y] = state.players.myself!.getAxes()
  let i = x - 1
  let j = y
  if (i < 0) i = 0
  this[i][j] && this[i][j]?.tick(state)
  j = y + 1
  this[i][j] && this[i][j]?.tick(state)
  i = x
  this[i][j] && this[i][j]?.tick(state)
  i = x + 1
  if (i > 10) i = 10
  this[i][j] && this[i][j]?.tick(state)
  j = y
  this[i][j] && this[i][j]?.tick(state)
  j = y - 1
  this[i][j] && this[i][j]?.tick(state)
  i = x
  this[i][j] && this[i][j]?.tick(state)
  i = x - 1
  if (i < 0) i = 0
  this[i][j] && this[i][j]?.tick(state)
}

function renderAndDestroy (this:Block, context:CanvasRenderingContext2D, state:GameState) {
  if (this.destroying) {
    if (Date.now() > this.destroyTime) {
      state.blocks.destroyBlock(this.axes, state)
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