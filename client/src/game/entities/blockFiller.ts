import { GameState } from '~/game/entities/state'
import { playBlockSound } from '~/game/sound/block'
import { Assets } from '~/game/util/assets'
import { isOnBlock } from '~/game/util/block'

interface Block {
  axes   : [number, number]
  x      : number
  y      : number
  finalY : number
}

export interface BlockFiller {
  blocks       : Block[]
  currentBlock : number
  id           : string
  tick   : (state:GameState) => void
  render : (context:CanvasRenderingContext2D) => void
}

const SPEED = 4

export function BlockFillerFactory () : BlockFiller {
  const blockFiller:BlockFiller = {
    blocks: createBlocks(),
    currentBlock: 0,
    id: 'blockFiller'
  } as unknown as BlockFiller
  blockFiller.tick = tick.bind(blockFiller)
  blockFiller.render = render.bind(blockFiller)
  return blockFiller
}

function createBlocks(): Block[] {
  const blocks = [
    // Top row
    {axes:[0,0], x:16, finalY:16}, {axes:[0,1], x:32, finalY:16}, {axes:[0,2], x:48, finalY:16}, {axes:[0,3], x:64, finalY:16}, {axes:[0,4], x:80, finalY:16}, {axes:[0,5], x:96, finalY:16}, {axes:[0,6], x:112, finalY:16}, {axes:[0,7], x:128, finalY:16}, {axes:[0,8], x:144, finalY:16}, {axes:[0,9], x:160, finalY:16}, {axes:[0,10], x:176, finalY:16}, {axes:[0,11], x:192, finalY:16}, {axes:[0,12], x:208, finalY:16},
    // Right row
    {axes:[1,12], x:208, finalY:32}, {axes:[2,12], x:208, finalY:48}, {axes:[3,12], x:208, finalY:64}, {axes:[4,12], x:208, finalY:80}, {axes:[5,12], x:208, finalY:96}, {axes:[6,12], x:208, finalY:112}, {axes:[7,12], x:208, finalY:128}, {axes:[8,12], x:208, finalY:144}, {axes:[9,12], x:208, finalY:160}, {axes:[10,12], x:208, finalY:176},
    // Bottom row
    {axes:[10,11], x:192, finalY:176}, {axes:[10,10], x:176, finalY:176}, {axes:[10,9], x:160, finalY:176}, {axes:[10,8], x:144, finalY:176}, {axes:[10,7], x:128, finalY:176}, {axes:[10,6], x:112, finalY:176}, {axes:[10,5], x:96, finalY:176}, {axes:[10,4], x:80, finalY:176}, {axes:[10,3], x:64, finalY:176}, {axes:[10,2], x:48, finalY:176}, {axes:[10,1], x:32, finalY:176}, {axes:[10,0], x:16, finalY:176},
    // Left row
    {axes:[9,0], x:16, finalY:160}, {axes:[8,0], x:16, finalY:144}, {axes:[7,0], x:16, finalY:128}, {axes:[6,0], x:16, finalY:112}, {axes:[5,0], x:16, finalY:96}, {axes:[4,0], x:16, finalY:80}, {axes:[3,0], x:16, finalY:64}, {axes:[2,0], x:16, finalY:48}, {axes:[1,0], x:16, finalY:32},
    // Top row
    {axes:[1,1], x:32, finalY:32}, {axes:[1,2], x:48, finalY:32}, {axes:[1,3], x:64, finalY:32}, {axes:[1,4], x:80, finalY:32}, {axes:[1,5], x:96, finalY:32}, {axes:[1,6], x:112, finalY:32}, {axes:[1,7], x:128, finalY:32}, {axes:[1,8], x:144, finalY:32}, {axes:[1,9], x:160, finalY:32}, {axes:[1,10], x:176, finalY:32}, {axes:[1,11], x:192, finalY:32},
    // Right row
    {axes:[2,11], x:192, finalY:48}, {axes:[3,11], x:192, finalY:64}, {axes:[4,11], x:192, finalY:80}, {axes:[5,11], x:192, finalY:96}, {axes:[6,11], x:192, finalY:112}, {axes:[7,11], x:192, finalY:128}, {axes:[8,11], x:192, finalY:144}, {axes:[9,11], x:192, finalY:160},
    // Bottom row
    {axes:[9,10], x:176, finalY:160}, {axes:[9,9], x:160, finalY:160}, {axes:[9,8], x:144, finalY:160}, {axes:[9,7], x:128, finalY:160}, {axes:[9,6], x:112, finalY:160}, {axes:[9,5], x:96, finalY:160}, {axes:[9,4], x:80, finalY:160}, {axes:[9,3], x:64, finalY:160}, {axes:[9,2], x:48, finalY:160}, {axes:[9,1], x:32, finalY:160},
    // Left row
    {axes:[8,1], x:32, finalY:144}, {axes:[7,1], x:32, finalY:128}, {axes:[6,1], x:32, finalY:112}, {axes:[5,1], x:32, finalY:96}, {axes:[4,1], x:32, finalY:80}, {axes:[3,1], x:32, finalY:64}, {axes:[2,1], x:32, finalY:48}
  ] as Block[]
  for (const i in blocks) {
    blocks[i].y = -16
  }
  return blocks
}


function tick (this:BlockFiller, state:GameState) {
  if (this.currentBlock === this.blocks.length) {
    state.entities.remove(this)
    if (isOnBlock(state)) {
      state.players.myself!.kill(true)
    }
    return
  }
  const block = this.blocks[this.currentBlock]
  block.y += SPEED
  if (block.y > block.finalY) {
    playBlockSound()
    state.blocks.putBlock({t:'I', x:block.x, y:block.finalY}, block.axes)
    this.currentBlock++
    const playerAxes = state.players.myself!.getAxes()
    if (block.axes[0] === playerAxes[0] && block.axes[1] === playerAxes[1]) {
      state.players.myself?.kill(true)
    }
  }
}

function render (this:BlockFiller, context:CanvasRenderingContext2D) {
  const block = this.blocks[this.currentBlock]
  if (!block) return
  context.drawImage(Assets.stageSprite, 0, 208, 16, 16, block.x, block.y, 16, 16)
}