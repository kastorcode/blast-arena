import { TILE_SIZE } from '#/constants'
import { KillDTO, MoveDTO, PlaceBombDTO, PlayerDTO, SIDES } from '#/dto'
import { animate, AnimControl } from '~/game/animations/animation'
import { PLAYER_D, PLAYER_DH, PLAYER_K, PLAYER_L, PLAYER_LH, PLAYER_R, PLAYER_RH, PLAYER_U, PLAYER_UH } from '~/game/animations/player'
import { BombFactory } from '~/game/entities/bomb'
import { GamepadFactory } from '~/game/entities/gamepad'
import { GameState } from '~/game/entities/state'
import socket from '~/services/socket'

interface PlayerProps extends PlayerDTO {
  index : number
  speed : number
  x     : number
  y     : number
}

export interface Player {
  anim       : AnimControl['anim']
  bombReach  : number
  bombs      : number
  holding    : 0|1
  index      : number
  moving     : 0|1
  myself     : boolean
  nick       : PlayerDTO['nick']
  removeTime : number
  side       : SIDES
  sprite     : HTMLImageElement
  speed      : number
  x          : number
  y          : number
  setMyself            : () => void
  getAxes              : () => [number, number]
  addInputListener     : (state:GameState) => void
  removeInputListener  : (state:GameState) => void
  removeGamepadSupport : (state:GameState) => void
  startMove            : (side:SIDES) => void
  moveTick             : (state:GameState) => void
  moves                : {[key in SIDES] : () => void}
  onMove               : (dto:MoveDTO) => void
  stopMove             : (side:SIDES) => void
  placeBomb            : (state:GameState) => void
  kill                 : (emit:boolean, state:GameState) => void
  tick                 : (state:GameState) => void
  render               : (context:CanvasRenderingContext2D) => void
}

const BOMB_KEYS : {[key:string]:'B'} = {
  'Z': 'B',
  'X': 'B',
  'C': 'B',
  ' ': 'B'
}

const MOVE_KEYS : {[key:string]:SIDES} = {
  'W': 'U',
  'A': 'L',
  'S': 'D',
  'D': 'R',
  'ARROWUP': 'U',
  'ARROWLEFT': 'L',
  'ARROWDOWN': 'D',
  'ARROWRIGHT': 'R'
}

const MOVING : {[key in SIDES]:boolean} = {
  U:false, L:false, D:false, R:false
}

export function PlayerFactory (props:PlayerProps) : Player {
  const player : Player = {
    anim: {frameCurrent:0, lastRender:0, sum:true},
    bombReach: 2,
    bombs: 1,
    holding: 0,
    index: props.index,
    moving: 0,
    myself: false,
    nick: props.nick,
    side: 'D',
    speed: props.speed,
    x: props.x,
    y: props.y,
    sprite: new Image()
  } as unknown as Player
  player.sprite.src = `/sprites/chars/${props.sprite}.png`
  player.setMyself = setMyself.bind(player)
  player.getAxes = getAxes.bind(player)
  player.addInputListener = addInputListener.bind(player)
  player.removeInputListener = removeInputListener.bind(player)
  player.removeGamepadSupport = removeGamepadSupport.bind(player)
  player.startMove = startMove.bind(player)
  player.moveTick = moveTick.bind(player)
  player.moves = { D: moveDown.bind(player), L: moveLeft.bind(player), R: moveRight.bind(player), U: moveUp.bind(player) }
  player.onMove = onMove.bind(player)
  player.stopMove = stopMove.bind(player)
  player.placeBomb = placeBomb.bind(player)
  player.kill = kill.bind(player)
  player.tick = tick.bind(player)
  player.render = render.bind(player)
  return player
}

function setMyself (this:Player) {
  this.myself = true
}

function getAxes (this:Player) : [number, number] {
  const x = Math.floor(this.y / TILE_SIZE)
  const y = Math.floor(((this.x - 1) / TILE_SIZE) - 0.5)
  return [x, y]
}

function addInputListener (this:Player, state:GameState) {
  document.addEventListener('visibilitychange', () => onVisibilityChange.call(this, state))
  document.addEventListener('keydown', event => keydownListener.call(this, event, state))
  document.addEventListener('keyup', keyupListener.bind(this))
  window.addEventListener('gamepaddisconnected', () => removeGamepadSupport.call(this, state))
  window.addEventListener('gamepadconnected', () => addGamepadSupport.call(this, state))
}

function removeInputListener (this:Player, state:GameState) {
  document.removeEventListener('visibilitychange', () => onVisibilityChange.call(this, state))
  document.removeEventListener('keydown', event => keydownListener.call(this, event, state))
  document.removeEventListener('keyup', keyupListener.bind(this))
  window.removeEventListener('gamepaddisconnected', () => removeGamepadSupport.call(this, state))
  window.removeEventListener('gamepadconnected', () => addGamepadSupport.call(this, state))
}

function onVisibilityChange (this:Player, state:GameState) {
  if (document.hidden) this.kill(true, state)
}

function keydownListener (this:Player, event:KeyboardEvent, state:GameState) {
  event.preventDefault()
  if (this.removeTime) return
  const key = event.key.toUpperCase()
  if (MOVE_KEYS[key]) this.startMove(MOVE_KEYS[key])
  if (BOMB_KEYS[key]) this.placeBomb(state)
}

function keyupListener (this:Player, event:KeyboardEvent) {
  event.preventDefault()
  if (this.removeTime) return
  const key = event.key.toUpperCase()
  if (MOVE_KEYS[key]) this.stopMove(MOVE_KEYS[key])
}

function addGamepadSupport (this:Player, state:GameState) {
  const id = `G${this.index}`
  if (state.entities.has(id)) return
  state.entities.add(GamepadFactory({id, index:0, player:this}))
}

function removeGamepadSupport (this:Player, state:GameState) {
  const gamepad = state.entities.get(`G${this.index}`)
  if (!gamepad) return
  state.entities.remove(gamepad)
}

function startMove (this:Player, side:SIDES) {
  MOVING[side] = true
  this.side = side
  this.moving = 1
}

function moveTick (this:Player, state:GameState) {
  if (!this.moving) return
  this.moves[this.side]()
  if (!this.myself) return
  state.blocks.tick(state)
  const dto:MoveDTO = {h:this.holding, i:this.index, m:this.moving, s:this.side, x:this.x, y:this.y}
  socket.emit('mv', dto)
}

function moveDown (this:Player) {
  this.y += this.speed
  if (this.y > 169) {
    this.y = 169
    this.moving = 0
  }
}

function moveUp (this:Player) {
  this.y -= this.speed
  if (this.y < 9) {
    this.y = 9
    this.moving = 0
  }
}

function moveRight (this:Player) {
  this.x += this.speed
  if (this.x > 209) {
    this.x = 209
    this.moving = 0
  }
}

function moveLeft (this:Player) {
  this.x -= this.speed
  if (this.x < 17) {
    this.x = 17
    this.moving = 0
  }
}

function onMove (this:Player, dto:MoveDTO) {
  this.holding = dto.h
  this.moving = dto.m
  this.side = dto.s
  this.x = dto.x
  this.y = dto.y
}

function stopMove (this:Player, side:SIDES) {
  MOVING[side] = false
  this.moving = 0
  for (const side in MOVING) {
    if (MOVING[side as SIDES]) {
      this.side = side as SIDES
      this.moving = 1
      break
    }
  }
  const dto:MoveDTO = {h:this.holding, i:this.index, m:this.moving, s:this.side, x:this.x, y:this.y}
  socket.emit('mv', dto)
}

function placeBomb (this:Player, state:GameState) {
  if (!this.bombs) return
  const axes = this.getAxes()
  const block = state.blocks.getBlock(axes)
  if (block) return
  this.bombs--
  state.blocks.occupyBlock(axes)
  const bomb = BombFactory({
    axes,
    player     : this,
    playerIndex: this.index,
    reach      : this.bombReach,
    state
  })
  const dto:PlaceBombDTO = {
    a: bomb.axes,
    i: bomb.playerIndex,
    r: bomb.reach,
    x: bomb.x,
    y: bomb.y
  }
  socket.emit('pb', dto)
  state.entities.add(bomb)
}

function kill (this:Player, emit:boolean, state:GameState) {
  if (this.removeTime) return
  this.removeTime = Date.now() + 350
  this.tick = () => {
    if (Date.now() > this.removeTime) {
      this.tick = () => {}
      this.render = () => {}
    }
  }
  this.render = (context:CanvasRenderingContext2D) => {
    const { sx, sy } = animate(this, PLAYER_K)
    context.drawImage(this.sprite, sx, sy, PLAYER_K.FRAME_WIDTH, PLAYER_K.FRAME_HEIGHT, this.x, this.y, PLAYER_K.FRAME_WIDTH, PLAYER_K.FRAME_HEIGHT)
  }
  if (!emit) return
  this.removeGamepadSupport(state)
  const dto:KillDTO = {i:this.index}
  socket.emit('kl', dto)
}

function tick (this:Player, state:GameState) {
  this.moveTick(state)
}

function render (this:Player, context:CanvasRenderingContext2D) {
  if (this.side === 'D') {
    if (this.holding) {
      if (this.moving) {
        const { sx, sy } = animate(this, PLAYER_DH)
        context.drawImage(this.sprite, sx, sy, PLAYER_DH.FRAME_WIDTH, PLAYER_DH.FRAME_HEIGHT, this.x, this.y, PLAYER_DH.FRAME_WIDTH, PLAYER_DH.FRAME_HEIGHT)
      }
      else {
        context.drawImage(this.sprite, PLAYER_DH.FRAME_WIDTH*4, PLAYER_DH.ROW, PLAYER_DH.FRAME_WIDTH, PLAYER_DH.FRAME_HEIGHT, this.x, this.y, PLAYER_DH.FRAME_WIDTH, PLAYER_DH.FRAME_HEIGHT)
      }
    }
    else if (this.moving) {
      const { sx, sy } = animate(this, PLAYER_D)
      context.drawImage(this.sprite, sx, sy, PLAYER_D.FRAME_WIDTH, PLAYER_D.FRAME_HEIGHT, this.x, this.y, PLAYER_D.FRAME_WIDTH, PLAYER_D.FRAME_HEIGHT)
    }
    else {
      context.drawImage(this.sprite, PLAYER_D.FRAME_WIDTH, PLAYER_D.ROW, PLAYER_D.FRAME_WIDTH, PLAYER_D.FRAME_HEIGHT, this.x, this.y, PLAYER_D.FRAME_WIDTH, PLAYER_D.FRAME_HEIGHT)
    }
  }
  else if (this.side === 'U') {
    if (this.holding) {
      if (this.moving) {
        const { sx, sy } = animate(this, PLAYER_UH)
        context.drawImage(this.sprite, sx, sy, PLAYER_UH.FRAME_WIDTH, PLAYER_UH.FRAME_HEIGHT, this.x, this.y, PLAYER_UH.FRAME_WIDTH, PLAYER_UH.FRAME_HEIGHT)
      }
      else {
        context.drawImage(this.sprite, PLAYER_UH.FRAME_WIDTH*4, PLAYER_UH.FRAME_HEIGHT, PLAYER_UH.FRAME_WIDTH, PLAYER_UH.FRAME_HEIGHT, this.x, this.y, PLAYER_UH.FRAME_WIDTH, PLAYER_UH.FRAME_HEIGHT)
      }
    }
    else if (this.moving) {
      const { sx, sy } = animate(this, PLAYER_U)
      context.drawImage(this.sprite, sx, sy, PLAYER_U.FRAME_WIDTH, PLAYER_U.FRAME_HEIGHT, this.x, this.y, PLAYER_U.FRAME_WIDTH, PLAYER_U.FRAME_HEIGHT)
    }
    else {
      context.drawImage(this.sprite, PLAYER_U.FRAME_WIDTH, PLAYER_U.FRAME_HEIGHT, PLAYER_U.FRAME_WIDTH, PLAYER_U.FRAME_HEIGHT, this.x, this.y, PLAYER_U.FRAME_WIDTH, PLAYER_U.FRAME_HEIGHT)
    }
  }
  else if (this.side === 'R') {
    if (this.holding) {
      if (this.moving) {
        const { sx, sy } = animate(this, PLAYER_RH)
        context.drawImage(this.sprite, sx, sy, PLAYER_RH.FRAME_WIDTH, PLAYER_RH.FRAME_HEIGHT, this.x, this.y, PLAYER_RH.FRAME_WIDTH, PLAYER_RH.FRAME_HEIGHT)
      }
      else {
        context.drawImage(this.sprite, PLAYER_RH.FRAME_WIDTH*4, PLAYER_RH.FRAME_HEIGHT*PLAYER_RH.ROW, PLAYER_RH.FRAME_WIDTH, PLAYER_RH.FRAME_HEIGHT, this.x, this.y, PLAYER_RH.FRAME_WIDTH, PLAYER_RH.FRAME_HEIGHT)
      }
    }
    else if (this.moving) {
      const { sx, sy } = animate(this, PLAYER_R)
      context.drawImage(this.sprite, sx, sy, PLAYER_R.FRAME_WIDTH, PLAYER_R.FRAME_HEIGHT, this.x, this.y, PLAYER_R.FRAME_WIDTH, PLAYER_R.FRAME_HEIGHT)
    }
    else {
      context.drawImage(this.sprite, PLAYER_R.FRAME_WIDTH, PLAYER_R.FRAME_HEIGHT*PLAYER_R.ROW, PLAYER_R.FRAME_WIDTH, PLAYER_R.FRAME_HEIGHT, this.x, this.y, PLAYER_R.FRAME_WIDTH, PLAYER_R.FRAME_HEIGHT)
    }
  }
  else {
    if (this.holding) {
      if (this.moving) {
        const { sx, sy } = animate(this, PLAYER_LH)
        context.drawImage(this.sprite, sx, sy, PLAYER_LH.FRAME_WIDTH, PLAYER_LH.FRAME_HEIGHT, this.x, this.y, PLAYER_LH.FRAME_WIDTH, PLAYER_LH.FRAME_HEIGHT)
      }
      else {
        context.drawImage(this.sprite, PLAYER_LH.FRAME_WIDTH*4, PLAYER_LH.FRAME_HEIGHT*PLAYER_LH.ROW, PLAYER_LH.FRAME_WIDTH, PLAYER_LH.FRAME_HEIGHT, this.x, this.y, PLAYER_LH.FRAME_WIDTH, PLAYER_LH.FRAME_HEIGHT)
      }
    }
    else if (this.moving) {
      const { sx, sy } = animate(this, PLAYER_L)
      context.drawImage(this.sprite, sx, sy, PLAYER_L.FRAME_WIDTH, PLAYER_L.FRAME_HEIGHT, this.x, this.y, PLAYER_L.FRAME_WIDTH, PLAYER_L.FRAME_HEIGHT)
    }
    else {
      context.drawImage(this.sprite, PLAYER_L.FRAME_WIDTH, PLAYER_L.FRAME_HEIGHT*PLAYER_L.ROW, PLAYER_L.FRAME_WIDTH, PLAYER_L.FRAME_HEIGHT, this.x, this.y, PLAYER_L.FRAME_WIDTH, PLAYER_L.FRAME_HEIGHT)
    }
  }
}