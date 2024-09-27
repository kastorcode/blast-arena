import { BOMB_MOVE, BOMB_SPEED, TILE_SIZE } from '#/constants'
import { SIDES } from '#/dto'
import { animate, AnimControl } from '~/game/animations/animation'
import { BOMB } from '~/game/animations/bomb'
import { Blast, BlastFactory, Directions } from '~/game/entities/blast'
import { Player } from '~/game/entities/player'
import { GameState } from '~/game/entities/state'
import { playBlastSound } from '~/game/sound/blast'
import { playFlingSound } from '~/game/sound/fling'
import { playKickSound } from '~/game/sound/kick'
import { Assets } from '~/game/util/assets'
import { isColliding, stopPlayer } from '~/game/util/collision'
import { emitMoveBomb } from '~/services/socket'

interface BombProps {
  axes        : [number, number]
  id         ?: string
  player     ?: Player
  playerIndex : number
  reach       : number
  x          ?: number
  y          ?: number
}

export interface Bomb {
  anim          : AnimControl['anim']
  armed         : boolean
  blast         : Blast
  collidable    : boolean
  detonated     : boolean
  detonateTime  : number
  directions    : Directions
  finalPosition : number
  flinging      : boolean
  holding       : boolean
  id            : string
  moving        : boolean
  player       ?: Player
  playerIndex   : number
  reach         : number
  removeTime    : number
  side          : SIDES
  x             : number
  y             : number
  moves  : {[key in SIDES]:(state:GameState) => void}
  flings : {[key in SIDES]:(state:GameState) => void}
  getAxes              : () => [number, number]
  setDetonation        : (multiplier?:number) => void
  detonate             : (state:GameState) => void
  checkPlayerCollision : (state:GameState) => void
  startMove            : (side:SIDES, state:GameState) => void
  stopMove             : (state:GameState) => void
  setHolding           : (playerIndex:number, state:GameState) => void
  startFling           : (side:SIDES) => void
  tick                 : (state:GameState) => void
  render               : (context:CanvasRenderingContext2D) => void
}

export function BombFactory (props : BombProps) : Bomb {
  const bomb:Bomb = props as unknown as Bomb
  if (props.player) {
    bomb.id = `O${Math.floor(Math.random() * 9999999)}`
    bomb.x = (props.axes[1] + 1) * TILE_SIZE || TILE_SIZE
    bomb.y = (props.axes[0] + 1) * TILE_SIZE || TILE_SIZE
  }
  bomb.anim = {frameCurrent:0, lastRender:0, sum:true}
  bomb.armed = true
  bomb.detonated = false
  bomb.blast = BlastFactory()
  bomb.collidable = false
  bomb.directions = {up:0, right:0, down:0, left:0}
  bomb.holding = false
  bomb.moving = false
  bomb.moves = {'D':moveDown.bind(bomb), 'U':moveUp.bind(bomb), 'R':moveRight.bind(bomb), 'L':moveLeft.bind(bomb)}
  bomb.flings = {'D':flingDown.bind(bomb), 'U':flingUp.bind(bomb), 'R':flingRight.bind(bomb), 'L':flingLeft.bind(bomb)}
  bomb.getAxes = getAxes.bind(bomb)
  bomb.setDetonation = setDetonation.bind(bomb)
  bomb.detonate = detonate.bind(bomb)
  bomb.checkPlayerCollision = checkPlayerCollision.bind(bomb)
  bomb.startMove = startMove.bind(bomb)
  bomb.stopMove = stopMove.bind(bomb)
  bomb.setHolding = setHolding.bind(bomb)
  bomb.startFling = startFling.bind(bomb)
  bomb.tick = tick.bind(bomb)
  bomb.render = render.bind(bomb)
  bomb.setDetonation()
  return bomb
}

function getAxes (this:Bomb) : [number, number] {
  const x = Math.round(this.y / TILE_SIZE) - 1
  const y = Math.round(this.x / TILE_SIZE) - 1
  return [x, y]
}

function setDetonation (this:Bomb, multiplier=1) {
  this.detonateTime = Date.now() + (3000 * multiplier)
  this.removeTime = this.detonateTime + 1000
}

function detonate (this:Bomb, state:GameState) {
  playBlastSound()
  if (this.holding) {
    if (this.playerIndex === state.players.myself!.index) {
      state.players.myself!.kill(true)
    }
    this.stopMove(state)
  }
  this.armed = false
  this.detonated = true
  const [ax, ay] = this.getAxes()
  for (let i = ax; i > -1; i--) {
    if (this.directions.up === this.reach) break
    const b = state.blocks.getBlock([i, ay])
    if (!b) this.directions.up++
    else if (b.t === 'D') {
      b.destroy()
      break
    }
    else if (b.t === 'I') break
    else {
      this.directions.up++
      state.blocks.destroyBlock([i, ay])
    }
  }
  for (let i = ay; i < 13; i++) {
    if (this.directions.right === this.reach) break
    const b = state.blocks.getBlock([ax, i])
    if (!b) this.directions.right++
    else if (b.t === 'D') {
      b.destroy()
      break
    }
    else if (b.t === 'I') break
    else {
      this.directions.right++
      state.blocks.destroyBlock([ax, i])
    }
  }
  for (let i = ax; i < 11; i++) {
    if (this.directions.down === this.reach) break
    const b = state.blocks.getBlock([i, ay])
    if (!b) this.directions.down++
    else if (b.t === 'D') {
      b.destroy()
      break
    }
    else if (b.t === 'I') break
    else {
      this.directions.down++
      state.blocks.destroyBlock([i, ay])
    }
  }
  for (let i = ay; i > -1; i--) {
    if (this.directions.left === this.reach) break
    const b = state.blocks.getBlock([ax, i])
    if (!b) this.directions.left++
    else if (b.t === 'D') {
      b.destroy()
      break
    }
    else if (b.t === 'I') break
    else {
      this.directions.left++
      state.blocks.destroyBlock([ax, i])
    }
  }
}

function checkPlayerCollision (this:Bomb, state:GameState) {
  const [px, py] = state.players.myself!.getAxes()
  const [ax, ay] = this.getAxes()
  for (let i = this.directions.up - 1; i > -1; i--) {
    if (px === ax - i && py === ay) {
      state.players.myself!.kill(true)
      return
    }
  }
  for (let i = this.directions.down - 1; i > -1; i--) {
    if (px === ax + i && py === ay) {
      state.players.myself!.kill(true)
      return
    }
  }
  for (let i = this.directions.left - 1; i > -1; i--) {
    if (px === ax && py === ay - i) {
      state.players.myself!.kill(true)
      return
    }
  }
  for (let i = this.directions.right - 1; i > -1; i--) {
    if (px === ax && py === ay + i) {
      state.players.myself!.kill(true)
      return
    }
  }
}

function startMove (this:Bomb, side:SIDES, state:GameState) {
  const [ax, ay] = this.getAxes()
  let move = 0
  try {
    if (side === 'D') {
      for (let i = 1; i < BOMB_MOVE; i++) {
        const b = state.blocks.getBlock([ax + i, ay])
        if (b && b.t !== 'B') break
        move++
      }
    }
    else if (side === 'U') {
      for (let i = 1; i < BOMB_MOVE; i++) {
        const b = state.blocks.getBlock([ax - i, ay])
        if (b && b.t !== 'B') break
        move++
      }
    }
    else if (side === 'R') {
      for (let i = 1; i < BOMB_MOVE; i++) {
        const b = state.blocks.getBlock([ax, ay + i])
        if (b && b.t !== 'B') break
        move++
      }
    }
    else if (side === 'L') {
      for (let i = 1; i < BOMB_MOVE; i++) {
        const b = state.blocks.getBlock([ax, ay - i])
        if (b && b.t !== 'B') break
        move++
      }
    }
  }
  catch {}
  if (move) {
    playKickSound()
    state.blocks.destroyBlock([ax, ay])
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
  if (this.holding) this.y += 12
  this.moving = false
  this.flinging = false
  this.holding = false
  this.x = Math.round(this.x / TILE_SIZE) * TILE_SIZE
  this.y = Math.round(this.y / TILE_SIZE) * TILE_SIZE
  state.blocks.putBomb(this)
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

function setHolding (this:Bomb, playerIndex:number, state:GameState) {
  state.blocks.destroyBlock(this.getAxes())
  this.playerIndex = playerIndex
  this.collidable = false
  this.holding = true
  this.setDetonation(2)
}

function startFling (this:Bomb, side:SIDES) {
  playFlingSound()
  this.holding = false
  this.collidable = false
  this.side = side
  this.flinging = true
  if (side === 'D') {
    this.finalPosition = this.y + (TILE_SIZE * 3)
  }
  else if (side === 'U') {
    this.finalPosition = this.y - TILE_SIZE
  }
  else if (side === 'R') {
    this.y += 12
    this.finalPosition = this.x + (TILE_SIZE * 2)
  }
  else if (side === 'L') {
    this.y += 12
    this.finalPosition = this.x - (TILE_SIZE * 2)
  }
  this.setDetonation()
}

function flingDown (this:Bomb, state:GameState) {
  this.y += BOMB_SPEED
  if (this.y > 180) {
    this.y = 0
    this.finalPosition = 16
  }
  else if (this.y >= this.finalPosition) {
    if (!state.blocks.getBlock(this.getAxes())) {
      this.stopMove(state)
    }
  }
}

function flingUp (this:Bomb, state:GameState) {
  this.y -= BOMB_SPEED
  if (this.y < 8) {
    this.y = 192
    this.finalPosition = 176
  }
  else if (this.y <= this.finalPosition) {
    if (!state.blocks.getBlock(this.getAxes())) {
      this.stopMove(state)
    }
  }
}

function flingRight (this:Bomb, state:GameState) {
  this.x += BOMB_SPEED
  if (this.x > 212) {
    this.x = 0
    this.finalPosition = 16
  }
  else if (this.x >= this.finalPosition) {
    if (!state.blocks.getBlock(this.getAxes())) {
      this.stopMove(state)
    }
  }
}

function flingLeft (this:Bomb, state:GameState) {
  this.x -= BOMB_SPEED
  if (this.x < 12) {
    this.x = 224
    this.finalPosition = 208
  }
  else if (this.x <= this.finalPosition) {
    if (!state.blocks.getBlock(this.getAxes())) {
      this.stopMove(state)
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
  else if (this.moving) {
    this.moves[this.side](state)
  }
  else if (this.flinging) {
    this.flings[this.side](state)
  }
  else if (this.holding) {
    this.x = state.players.players[this.playerIndex].x
    this.y = state.players.players[this.playerIndex].y - 9
  }
  if (this.armed) {
    if (this.collidable) {
      if (isColliding(state.players.myself!, this)) {
        if (state.players.myself!.kick) {
          emitMoveBomb({i:this.id,p:this.playerIndex,s:state.players.myself!.side})
          this.startMove(state.players.myself!.side, state)
        }
        stopPlayer(state.players.myself!, this)
      }
    }
    else if (!isColliding(state.players.myself!, this)) {
      if (!this.moving && !this.flinging) {
        this.collidable = true
      }
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
    context.drawImage(Assets.bombSprite, sx, sy, BOMB.FRAME_WIDTH, BOMB.FRAME_HEIGHT, this.x, this.y, BOMB.FRAME_WIDTH, BOMB.FRAME_HEIGHT)
  }
  else {
    this.blast.render(context, this.directions, this.x, this.y)
  }
}