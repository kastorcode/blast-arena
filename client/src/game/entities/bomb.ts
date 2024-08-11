import { TILE_SIZE } from '#/constants'
import { animate, AnimControl } from '~/game/animations/animation'
import { BOMB } from '~/game/animations/bomb'
import { Blast, BlastFactory, Directions } from '~/game/entities/blast'
import { Player } from '~/game/entities/player'
import { GameState } from '~/game/entities/state'

interface BombProps {
  axes       ?: [number, number]
  player     ?: Player
  playerIndex : number
  reach       : number
  state       : GameState
  x          ?: number
  y          ?: number
}

interface Bomb {
  anim         : AnimControl['anim']
  armed        : boolean
  axes         : [number, number]
  blast        : Blast
  detonateTime : number
  directions   : Directions
  id           : string
  player      ?: Player
  playerIndex  : number
  reach        : number
  removeTime   : number
  sprite       : HTMLImageElement
  x            : number
  y            : number
  setId    : (id:number) => void
  detonate : (state:GameState) => void
  tick     : (state:GameState) => void
  render   : (context:CanvasRenderingContext2D) => void
}

export function BombFactory (props : BombProps) : Bomb {
  const bomb : Bomb = props as unknown as Bomb
  if (props.player) {
    const [x,y] = props.player.getAxes()
    bomb.axes = [x, y]
    bomb.x = (y + 1) * TILE_SIZE || TILE_SIZE
    bomb.y = (x + 1) * TILE_SIZE || TILE_SIZE
  }
  bomb.sprite = new Image()
  bomb.sprite.src = `/sprites/bombs/${props.state.bomb}.png`
  bomb.anim = {frameCurrent:0, lastRender:0, sum:true}
  bomb.armed = true
  bomb.blast = BlastFactory(props.state)
  bomb.directions = {up:0, right:0, down:0, left:0}
  bomb.id = 'B'
  bomb.setId = setId.bind(bomb)
  bomb.detonate = detonate.bind(bomb)
  bomb.tick = tick.bind(bomb)
  bomb.render = render.bind(bomb)
  bomb.detonateTime = Date.now() + 3000
  bomb.removeTime = bomb.detonateTime + 1000
  return bomb
}

function setId (this:Bomb, id:number) {
  this.id += id
}

function detonate (this:Bomb, state:GameState) {
  for (let i = this.axes[0]; i > -1; i--) {
    if (this.directions.up === this.reach) break
    const b = state.blocks.getBlock(i, this.axes[1])
    if (!b) this.directions.up++
    else {
      b.destroy()
      break
    }
  }
  for (let i = this.axes[1]; i < 13; i++) {
    if (this.directions.right === this.reach) break
    const b = state.blocks.getBlock(this.axes[0], i)
    if (!b) this.directions.right++
    else {
      b.destroy()
      break
    }
  }
  for (let i = this.axes[0]; i < 11; i++) {
    if (this.directions.down === this.reach) break
    const b = state.blocks.getBlock(i, this.axes[1])
    if (!b) this.directions.down++
    else {
      b.destroy()
      break
    }
  }
  for (let i = this.axes[1]; i > -1; i--) {
    if (this.directions.left === this.reach) break
    const b = state.blocks.getBlock(this.axes[0], i)
    if (!b) this.directions.left++
    else {
      b.destroy()
      break
    }
  }
}

function tick (this:Bomb, state:GameState) {
  if (this.armed && Date.now() > this.detonateTime) {
    if (this.player) this.player.bombs++
    this.armed = false
    this.detonate(state)
  }
  else if (Date.now() > this.removeTime) {
    state.entities.remove(this)
  }
}

function render (this:Bomb, context:CanvasRenderingContext2D) {
  if (this.armed) {
    const { sx, sy } = animate(this, BOMB)
    context.drawImage(this.sprite, sx, sy, BOMB.FRAME_WIDTH, BOMB.FRAME_HEIGHT, this.x, this.y, BOMB.FRAME_WIDTH, BOMB.FRAME_HEIGHT)
  }
  else {
    this.blast.render(context, this.directions, this.x, this.y)
  }
}