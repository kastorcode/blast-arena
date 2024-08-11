import { TILE_SIZE } from '#/constants'
import { animate, AnimControl } from '~/game/animations/animation'
import { BLAST_C, BLAST_D, BLAST_H, BLAST_L, BLAST_R, BLAST_U, BLAST_V } from '~/game/animations/blast'
import { GameState } from '~/game/entities/state'

export interface Blast {
  anim   : AnimControl['anim']
  sprite : HTMLImageElement
  render : (context:CanvasRenderingContext2D, directions:Directions, x:number, y:number) => void
}

export interface Directions {
  up    : number
  right : number
  down  : number
  left  : number
}

export function BlastFactory (state:GameState) : Blast {
  const blast : Blast = {
    anim: {frameCurrent:0, lastRender:0, sum:true},
    sprite: new Image()
  } as Blast
  blast.sprite.src = `/sprites/blasts/${state.blast}.png`
  blast.render = render.bind(blast)
  return blast
}

function render (this:Blast, context:CanvasRenderingContext2D, directions:Directions, x:number, y:number) {
  const v = animate(this, BLAST_V)
  if (directions.up > 1) {
    for (let i = 1; i <= directions.up; i++) {
      if (i === directions.up) {
        const { sx, sy } = animate(this, BLAST_U)
        context.drawImage(this.sprite, sx, sy, BLAST_U.FRAME_WIDTH, BLAST_U.FRAME_HEIGHT, x, y - ((i - 1) * TILE_SIZE), BLAST_U.FRAME_WIDTH, BLAST_U.FRAME_HEIGHT)
      }
      else {
        context.drawImage(this.sprite, v.sx, v.sy, BLAST_V.FRAME_WIDTH, BLAST_V.FRAME_HEIGHT, x, y - ((i - 1) * TILE_SIZE), BLAST_V.FRAME_WIDTH, BLAST_V.FRAME_HEIGHT)
      }
    }
  }
  if (directions.down > 1) {
    for (let i = 1; i <= directions.down; i++) {
      if (i === directions.down) {
        const { sx, sy } = animate(this, BLAST_D)
        context.drawImage(this.sprite, sx, sy, BLAST_D.FRAME_WIDTH, BLAST_D.FRAME_HEIGHT, x, y + ((i - 1) * TILE_SIZE), BLAST_D.FRAME_WIDTH, BLAST_D.FRAME_HEIGHT)
      }
      else {
        context.drawImage(this.sprite, v.sx, v.sy, BLAST_V.FRAME_WIDTH, BLAST_V.FRAME_HEIGHT, x, y + ((i - 1) * TILE_SIZE), BLAST_V.FRAME_WIDTH, BLAST_V.FRAME_HEIGHT)
      }
    }
  }
  const h = animate(this, BLAST_H)
  if (directions.right > 1) {
    for (let i = 1; i <= directions.right; i++) {
      if (i === directions.right) {
        const { sx, sy } = animate(this, BLAST_R)
        context.drawImage(this.sprite, sx, sy, BLAST_R.FRAME_WIDTH, BLAST_R.FRAME_HEIGHT, x + ((i - 1) * TILE_SIZE), y, BLAST_R.FRAME_WIDTH, BLAST_R.FRAME_HEIGHT)
      }
      else {
        context.drawImage(this.sprite, h.sx, h.sy, BLAST_H.FRAME_WIDTH, BLAST_H.FRAME_HEIGHT, x + ((i - 1) * TILE_SIZE), y, BLAST_H.FRAME_WIDTH, BLAST_H.FRAME_HEIGHT)
      }
    }
  }
  if (directions.left > 1) {
    for (let i = 1; i <= directions.left; i++) {
      if (i === directions.left) {
        const { sx, sy } = animate(this, BLAST_L)
        context.drawImage(this.sprite, sx, sy, BLAST_L.FRAME_WIDTH, BLAST_L.FRAME_HEIGHT, x - ((i - 1) * TILE_SIZE), y, BLAST_L.FRAME_WIDTH, BLAST_L.FRAME_HEIGHT)
      }
      else {
        context.drawImage(this.sprite, h.sx, h.sy, BLAST_H.FRAME_WIDTH, BLAST_H.FRAME_HEIGHT, x - ((i - 1) * TILE_SIZE), y, BLAST_H.FRAME_WIDTH, BLAST_H.FRAME_HEIGHT)
      }
    }
  }
  const { sx, sy } = animate(this, BLAST_C)
  context.drawImage(this.sprite, sx, sy, BLAST_C.FRAME_WIDTH, BLAST_C.FRAME_HEIGHT, x, y, BLAST_C.FRAME_WIDTH, BLAST_C.FRAME_HEIGHT)
}