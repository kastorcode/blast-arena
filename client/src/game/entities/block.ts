import { SPEED, TILE_SIZE } from '#/constants'
import { BlockDTO } from '#/dto'
import { animate, AnimControl } from '~/game/animations/animation'
import { BLOCK } from '~/game/animations/block'
import { Bomb } from '~/game/entities/bomb'
import { Bonus, BonusFactory } from '~/game/entities/bonus'
import { GameState } from '~/game/entities/state'
import { Assets } from '~/game/util/assets'
import { isColliding, stopPlayer } from '~/game/util/collision'

export interface Blocks {
  blocks : (Block|Bonus|BombBlock|null)[][]
  getBlock     : (axes:[number,number]) => Block|Bonus|BombBlock|null
  destroyBlock : (axes:[number,number]) => void
  putBlock     : (dto:BlockDTO, axes:[number,number]) => void
  putBomb      : (bomb:Bomb) => void
  tick         : (state:GameState) => void
  render       : (context:CanvasRenderingContext2D, state:GameState) => void
}

interface Block extends BlockDTO {
  anim        : AnimControl['anim']
  axes        : [number, number]
  destroying  : boolean
  destroyTime : number
  destroy : () => void
  tick    : (state:GameState) => boolean
  render  : (context:CanvasRenderingContext2D, state:GameState) => void
}

interface BombBlock {
  id : string
  t  : 'O'
  tick   : () => void
  render : () => void
}

const TOLERANCE_UP = 8
const TOLERANCE_DOWN = 2

export function BlocksFactory (blocksDto : (BlockDTO|null)[][]) : Blocks {
  const blocks = blocksDto.map((row,i) => row.map((dto,j) => createBlock(dto, [i,j])))
  const getBlock = getOneBlock.bind(blocks)
  const destroyBlock = nullifyBlock.bind(blocks)
  const putBlock = putOneBlock.bind(blocks)
  const putBomb = putOneBomb.bind(blocks)
  const tick = tickPlayer.bind(blocks)
  const render = renderBlocks.bind(blocks)
  return { blocks, getBlock, destroyBlock, putBlock, putBomb, tick, render }
}

function createBlock (dto:BlockDTO|null, axes:[number,number]) {
  if (!dto) return null
  const block:Block = dto as Block
  block.axes = axes
  if (block.t === 'D') {
    block.anim = {frameCurrent:0, lastRender:0, sum:true}
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
}

function getOneBlock (this:Blocks['blocks'], axes:[number,number]) : Block|Bonus|BombBlock|null {
  return this[axes[0]][axes[1]]
}

function startDestroyBlock (this:Block) {
  this.destroying = true
  this.destroyTime = Date.now() + 600
  this.tick = () => false
}

function nullifyBlock (this:Blocks['blocks'], axes:[number,number]) {
  const block = this[axes[0]][axes[1]] as Block
  if (block && block.b) {
    this[axes[0]][axes[1]] = BonusFactory({
      axes, bonus:block.b, x:block.x, y:block.y
    })
  }
  else {
    this[axes[0]][axes[1]] = null
  }
}

function putOneBlock (this:Blocks['blocks'], dto:BlockDTO, axes:[number,number]) {
  const block = createBlock(dto, axes) as Block
  block.render = (context:CanvasRenderingContext2D) => {
    context.drawImage(Assets.stageSprite, 0, 208, 16, 16, block.x, block.y, 16, 16)
  }
  this[axes[0]][axes[1]] = block
}

function putOneBomb (this:Blocks['blocks'], bomb:Bomb) {
  const [ax, ay] = bomb.getAxes()
  const block = this[ax][ay]
  if (block && block.t === 'I') return
  const b:BombBlock = {
    id: bomb.id,
    t: 'O',
    tick: () => {},
    render: () => {}
  }
  this[ax][ay] = b
}

function tickD (this:Block, state:GameState) : boolean {
  const colliding = isColliding(state.players.myself!, this)
  if (colliding) stopPlayer(state.players.myself!, this)
  return colliding
}

function tickI (this:Block, state:GameState) : boolean {
  const colliding = isColliding(state.players.myself!, this)
  if (colliding) {
    const p = state.players.myself!
    const prevX = p.x
    const prevY = p.y
    if (p.x + 15 > this.x && p.side === 'R') {
      p.x = this.x - 15
      if (p.y + 23 - this.y <= TOLERANCE_UP) {
        p.y = Math.floor(p.y - SPEED)
        p.x = Math.floor(p.x + SPEED)
      }
      else if (p.y - this.y >= TOLERANCE_DOWN) {
        const b = state.blocks.getBlock([this.axes[0]+1, this.axes[1]])
        if (!b || b.t === 'B') {
          p.y = Math.floor(p.y + SPEED)
          p.x = Math.floor(p.x + SPEED)
        }
        else p.moving = 0
      }
      else p.moving = 0
    }
    else if (p.x < this.x + TILE_SIZE && p.side === 'L') {
      p.x = this.x + 16
      if (p.y + 23 - this.y <= TOLERANCE_UP) {
        const b = state.blocks.getBlock([this.axes[0]-1, this.axes[1]])
        if (!b || b.t === 'B') {
          p.y = Math.floor(p.y - SPEED)
          p.x = Math.floor(p.x - SPEED)
        }
        else p.moving = 0
      }
      else if (p.y - this.y >= TOLERANCE_DOWN) {
        p.y = Math.floor(p.y + SPEED)
        p.x = Math.floor(p.x - SPEED)
      }
      else p.moving = 0
    }
    else if (p.y + 23 > this.y && p.side === 'D') {
      p.y = this.y - 23
      if (p.x + 15 - this.x <= TOLERANCE_UP) {
        p.x = Math.floor(p.x - SPEED)
        p.y = Math.floor(p.y + SPEED)
      }
      else if (this.x + TILE_SIZE - p.x <= TOLERANCE_UP) {
        p.x = Math.floor(p.x + SPEED)
        p.y = Math.floor(p.y + SPEED)
      }
      else p.moving = 0
    }
    else if (p.y < this.y + TILE_SIZE && p.side === 'U') {
      p.y = this.y + 9
      if (p.x + 15 - this.x <= TOLERANCE_UP) {
        p.x = Math.floor(p.x - SPEED)
        p.y = Math.floor(p.y - SPEED)
      }
      else if (this.x + TILE_SIZE - p.x <= TOLERANCE_UP) {
        p.x = Math.floor(p.x + SPEED)
        p.y = Math.floor(p.y - SPEED)
      }
      else p.moving = 0
    }
    const deltaX = p.x - prevX
    const deltaY = p.y - prevY
    if (!(deltaX > -3 && deltaX < 3)) {
      p.x = prevX
    }
    if (!(deltaY > -3 && deltaY < 3)) {
      p.y = prevY
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
      state.blocks.destroyBlock(this.axes)
    }
    else {
      const { sx, sy } = animate(this, BLOCK)
      context.drawImage(Assets.stageSprite, sx, sy, BLOCK.FRAME_WIDTH, BLOCK.FRAME_HEIGHT, this.x, this.y, BLOCK.FRAME_WIDTH, BLOCK.FRAME_HEIGHT)
    }
  }
  else {
    context.drawImage(Assets.stageSprite, 16, 208, TILE_SIZE, TILE_SIZE, this.x, this.y, TILE_SIZE, TILE_SIZE)
  }
}

function renderBlocks (this:Blocks['blocks'], context:CanvasRenderingContext2D, state:GameState) {
  this.forEach(row => row.forEach(b => b && b.render(context, state)))
}