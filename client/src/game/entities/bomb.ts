import { TILE_SIZE } from '#/constants'
import { animate, AnimController } from '~/game/animations/animation'
import { BOMB } from '~/game/animations/bomb'
import { GameState } from '~/game/entities/state'
import { Player } from './player'
import TILE_IMG from '../components/tileImg'

interface BombProps {
  player     ?: Player
  playerIndex : number
  state       : GameState
  x          ?: number
  y          ?: number
}

interface Bomb {
  anim         : AnimController['anim']
  armed        : boolean
  detonateTime : number
  detonation   : number
  id           : number
  player      ?: Player
  playerIndex  : number
  removeTime   : number
  sprite       : HTMLImageElement
  x            : number
  y            : number
  setId        : (id : number) => void
  detonate     : () => void
  tick   : (state : GameState) => void
  render : (context : CanvasRenderingContext2D) => void
}

export function BombFactory (props : BombProps) : Bomb {
  const bomb : Bomb = props as unknown as Bomb
  if (props.player) {
    const [x,y] = props.player.getAxes()
    bomb.x = (y + 1) * TILE_SIZE || TILE_SIZE
    bomb.y = (x + 1) * TILE_SIZE || TILE_SIZE
  }
  bomb.sprite = new Image()
  bomb.sprite.src = `/sprites/bombs/${props.state.bomb}.png`
  bomb.anim = { frameCurrent:0, lastRender:0, sum:true }
  bomb.armed = true
  bomb.detonation = 3000
  bomb.setId = setId.bind(bomb)
  bomb.detonate = detonate.bind(bomb)
  bomb.tick = tick.bind(bomb)
  bomb.render = render.bind(bomb)
  bomb.detonateTime = Date.now() + bomb.detonation
  bomb.removeTime = bomb.detonateTime + bomb.detonation
  return bomb
}

function setId (this:Bomb, id:number) {
  this.id = id
}

function detonate (this:Bomb) {}

function tick (this:Bomb, state:GameState) {
  if (this.armed && Date.now() > this.detonateTime) {
    this.armed = false
    this.detonate()
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
    context.drawImage(TILE_IMG, 0, 0, 16, 16, this.x, this.y, 16, 16)
  }
}