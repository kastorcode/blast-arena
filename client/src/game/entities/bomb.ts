import { BOMB_MOVE, BOMB_SPEED, TILE_SIZE } from '#/constants'
import { MoveBombDTO, SIDES } from '#/dto'
import { animate, AnimControl } from '~/game/animations/animation'
import { BOMB } from '~/game/animations/bomb'
import { Blast, BlastFactory, Directions } from '~/game/entities/blast'
import { Player } from '~/game/entities/player'
import { GameState } from '~/game/entities/state'
import { isColliding, stopPlayer } from '~/game/util/collision'
import socket from '~/services/socket'

interface BombProps {
  axes        : [number, number]
  id         ?: string
  player     ?: Player
  playerIndex : number
  reach       : number
  state       : GameState
  x          ?: number
  y          ?: number
}

export interface Bomb {
  anim          : AnimControl['anim']
  armed         : boolean
  axes          : [number, number]
  blast         : Blast
  collidable    : boolean
  detonated     : boolean
  detonateTime  : number
  directions    : Directions
  finalPosition : number
  id            : string
  moves         : {[key in SIDES]:(state:GameState) => void}
  moving        : boolean
  player       ?: Player
  playerIndex   : number
  reach         : number
  removeTime    : number
  side          : SIDES
  sprite        : HTMLImageElement
  x             : number
  y             : number
  setDetonation        : () => void
  detonate             : (state:GameState) => void
  checkPlayerCollision : (state:GameState) => void
  startMove            : (side:SIDES, state:GameState) => void
  stopMove             : (state:GameState) => void
  tick                 : (state:GameState) => void
  render               : (context:CanvasRenderingContext2D) => void
}

export function BombFactory (props : BombProps) : Bomb {
  const bomb:Bomb = props as unknown as Bomb
  if (props.player) {
    bomb.id = `B${Math.floor(Math.random() * 9999999)}`
    bomb.x = (props.axes[1] + 1) * TILE_SIZE || TILE_SIZE
    bomb.y = (props.axes[0] + 1) * TILE_SIZE || TILE_SIZE
  }
  bomb.sprite = new Image()
  bomb.sprite.src = `/sprites/bombs/${props.state.bomb}.png`
  bomb.anim = {frameCurrent:0, lastRender:0, sum:true}
  bomb.armed = true
  bomb.detonated = false
  bomb.blast = BlastFactory(props.state)
  bomb.collidable = false
  bomb.directions = {up:0, right:0, down:0, left:0}
  bomb.moves = {'D':moveDown.bind(bomb), 'U':moveUp.bind(bomb), 'R':moveRight.bind(bomb), 'L':moveLeft.bind(bomb)}
  bomb.moving = false
  bomb.setDetonation = setDetonation.bind(bomb)
  bomb.detonate = detonate.bind(bomb)
  bomb.checkPlayerCollision = checkPlayerCollision.bind(bomb)
  bomb.startMove = startMove.bind(bomb)
  bomb.stopMove = stopMove.bind(bomb)
  bomb.tick = tick.bind(bomb)
  bomb.render = render.bind(bomb)
  bomb.setDetonation()
  return bomb
}

function setDetonation (this:Bomb) {
  this.detonateTime = Date.now() + 3000
  this.removeTime = this.detonateTime + 1000
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
      state.players.myself?.kill(true, state)
      return
    }
  }
  for (let i = this.directions.down - 1; i > -1; i--) {
    if (x === this.axes[0] + i && y === this.axes[1]) {
      state.players.myself?.kill(true, state)
      return
    }
  }
  for (let i = this.directions.left - 1; i > -1; i--) {
    if (x === this.axes[0] && y === this.axes[1] - i) {
      state.players.myself?.kill(true, state)
      return
    }
  }
  for (let i = this.directions.right - 1; i > -1; i--) {
    if (x === this.axes[0] && y === this.axes[1] + i) {
      state.players.myself?.kill(true, state)
      return
    }
  }
}

function startMove (this:Bomb, side:SIDES, state:GameState) {
  let move = 0
  try {
    if (side === 'D') {
      for (let i = 1; i < BOMB_MOVE; i++) {
        const b = state.blocks.getBlock([this.axes[0] + i, this.axes[1]])
        if (b && b.t !== 'B') break
        move++
      }
    }
    else if (side === 'U') {
      for (let i = 1; i < BOMB_MOVE; i++) {
        const b = state.blocks.getBlock([this.axes[0] - i, this.axes[1]])
        if (b && b.t !== 'B') break
        move++
      }
    }
    else if (side === 'R') {
      for (let i = 1; i < BOMB_MOVE; i++) {
        const b = state.blocks.getBlock([this.axes[0], this.axes[1] + i])
        if (b && b.t !== 'B') break
        move++
      }
    }
    else if (side === 'L') {
      for (let i = 1; i < BOMB_MOVE; i++) {
        const b = state.blocks.getBlock([this.axes[0], this.axes[1] - i])
        if (b && b.t !== 'B') break
        move++
      }
    }
  }
  catch {}
  if (move) {
    state.blocks.destroyBlock(this.axes, state)
    this.collidable = false
    this.side = side
    this.moving = true
    if (side === 'D') {
      this.finalPosition = this.y + (TILE_SIZE * move)
      this.setDetonation()
    }
    else if (side === 'U') {
      this.finalPosition = this.y - (TILE_SIZE * move)
      this.setDetonation()
    }
    else if (side === 'R') {
      this.finalPosition = this.x + (TILE_SIZE * move)
      if (this.finalPosition < 208) this.setDetonation()
    }
    else if (side === 'L') {
      this.finalPosition = this.x - (TILE_SIZE * move)
      if (this.finalPosition > 16) this.setDetonation()
    }
  }
}

function stopMove (this:Bomb, state:GameState) {
  this.moving = false
  this.axes = [Math.floor(this.y / TILE_SIZE) - 1, Math.floor(this.x / TILE_SIZE) - 1]
  if (!isColliding(state.players.myself!, this)) {
    this.collidable = true
  }
}

function moveDown (this:Bomb, state:GameState) {
  this.y += BOMB_SPEED
  if (this.y >= this.finalPosition)
    this.stopMove(state)
}

function moveUp (this:Bomb, state:GameState) {
  this.y -= BOMB_SPEED
  if (this.y <= this.finalPosition)
    this.stopMove(state)
}

function moveRight (this:Bomb, state:GameState) {
  this.x += BOMB_SPEED
  if (this.x >= this.finalPosition) {
    this.stopMove(state)
  }
  else if (this.x > 208) {
    this.x = 208
    this.stopMove(state)
  }
}

function moveLeft (this:Bomb, state:GameState) {
  this.x -= BOMB_SPEED
  if (this.x <= this.finalPosition) {
    this.stopMove(state)
  }
  else if (this.x < 16) {
    this.x = 16
    this.stopMove(state)
  }
}

function tick (this:Bomb, state:GameState) {
  if (this.detonated) {
    this.checkPlayerCollision(state)
  }
  if (Date.now() > this.removeTime) {
    state.entities.remove(this)
  }
  else if (this.moving) {
    this.moves[this.side](state)
  }
  else if (this.armed) {
    if (this.collidable) {
      if (isColliding(state.players.myself!, this)) {
        if (state.players.myself!.kick) {
          const dto:MoveBombDTO = {i:this.id,p:this.playerIndex,s:state.players.myself!.side}
          socket.emit('mb', dto)
          this.startMove(state.players.myself!.side, state)
        }
        stopPlayer(state.players.myself!, this)
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