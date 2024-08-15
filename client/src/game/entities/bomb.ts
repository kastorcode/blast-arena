import { TILE_SIZE } from '#/constants'
import { animate, AnimControl } from '~/game/animations/animation'
import { BOMB } from '~/game/animations/bomb'
import { Blast, BlastFactory, Directions } from '~/game/entities/blast'
import { Player } from '~/game/entities/player'
import { GameState } from '~/game/entities/state'
import { isColliding, stopPlayer } from '~/game/util/collision'

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
  collidable   : boolean
  detonated    : boolean
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
  detonate             : (state:GameState) => void
  checkPlayerCollision : (state:GameState) => void
  tick                 : (state:GameState) => void
  render               : (context:CanvasRenderingContext2D) => void
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
  bomb.detonated = false
  bomb.blast = BlastFactory(props.state)
  bomb.collidable = false
  bomb.directions = {up:0, right:0, down:0, left:0}
  bomb.id = `B${Math.floor(Math.random() * 9999999)}`
  bomb.detonate = detonate.bind(bomb)
  bomb.checkPlayerCollision = checkPlayerCollision.bind(bomb)
  bomb.tick = tick.bind(bomb)
  bomb.render = render.bind(bomb)
  bomb.detonateTime = Date.now() + 3000
  bomb.removeTime = bomb.detonateTime + 1500
  return bomb
}

function detonate (this:Bomb, state:GameState) {
  this.armed = false
  this.detonated = true
  for (let i = this.axes[0]; i > -1; i--) {
    if (this.directions.up === this.reach) break
    const b = state.blocks.getBlock([i, this.axes[1]])
    if (!b) this.directions.up++
    else if (b.t === 'D') {
      b.destroy()
      break
    }
    else if (b.t === 'I') break
    else {
      this.directions.up++
      state.blocks.destroyBlock([i, this.axes[1]], state)
    }
  }
  for (let i = this.axes[1]; i < 13; i++) {
    if (this.directions.right === this.reach) break
    const b = state.blocks.getBlock([this.axes[0], i])
    if (!b) this.directions.right++
    else if (b.t === 'D') {
      b.destroy()
      break
    }
    else if (b.t === 'I') break
    else {
      this.directions.right++
      state.blocks.destroyBlock([this.axes[0], i], state)
    }
  }
  for (let i = this.axes[0]; i < 11; i++) {
    if (this.directions.down === this.reach) break
    const b = state.blocks.getBlock([i, this.axes[1]])
    if (!b) this.directions.down++
    else if (b.t === 'D') {
      b.destroy()
      break
    }
    else if (b.t === 'I') break
    else {
      this.directions.down++
      state.blocks.destroyBlock([i, this.axes[1]], state)
    }
  }
  for (let i = this.axes[1]; i > -1; i--) {
    if (this.directions.left === this.reach) break
    const b = state.blocks.getBlock([this.axes[0], i])
    if (!b) this.directions.left++
    else if (b.t === 'D') {
      b.destroy()
      break
    }
    else if (b.t === 'I') break
    else {
      this.directions.left++
      state.blocks.destroyBlock([this.axes[0], i], state)
    }
  }
}

function checkPlayerCollision (this:Bomb, state:GameState) {
  const [x, y] = state.players.myself?.getAxes() as [number, number]
  for (let i = this.directions.up - 1; i > -1; i--) {
    if (x === this.axes[0] - i && y === this.axes[1]) {
      state.players.myself?.kill(true)
      return
    }
  }
  for (let i = this.directions.down - 1; i > -1; i--) {
    if (x === this.axes[0] + i && y === this.axes[1]) {
      state.players.myself?.kill(true)
      return
    }
  }
  for (let i = this.directions.left - 1; i > -1; i--) {
    if (x === this.axes[0] && y === this.axes[1] - i) {
      state.players.myself?.kill(true)
      return
    }
  }
  for (let i = this.directions.right - 1; i > -1; i--) {
    if (x === this.axes[0] && y === this.axes[1] + i) {
      state.players.myself?.kill(true)
      return
    }
  }
}

function tick (this:Bomb, state:GameState) {
  if (this.detonated) {
    this.checkPlayerCollision(state)
  }
  if (Date.now() > this.removeTime) {
    state.entities.remove(this)
  }
  else if (this.armed) {
    if (this.collidable) {
      if (isColliding(state.players.myself as Player, this)) {
        stopPlayer(state.players.myself as Player, this)
      }
    }
    else if (!isColliding(state.players.myself as Player, this)) {
      this.collidable = true
    }
    if (Date.now() > this.detonateTime) {
      if (this.player) this.player.bombs++
      this.detonate(state)
    }
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