import { MoveDTO, PlayerDTO, SIDES } from '#/dto'
import { Animation } from '~/game/animations/animation'
import { PLAYER_D } from '~/game/animations/playerDown'
import { PLAYER_DH } from '~/game/animations/playerDownHolding'
import { PLAYER_L } from '~/game/animations/playerLeft'
import { PLAYER_LH } from '~/game/animations/playerLeftHolding'
import { PLAYER_R } from '~/game/animations/playerRight'
import { PLAYER_RH } from '~/game/animations/playerRightHolding'
import { PLAYER_U } from '~/game/animations/playerUp'
import { PLAYER_UH } from '~/game/animations/playerUpHolding'
import socket from '~/services/socket'

interface PlayerProps extends PlayerDTO {
  index : number
  speed : number
  x     : number
  y     : number
}

interface Player {
  anim : {
    frameCurrent : number
    lastRender   : number
    sum          : boolean
  }
  holding  : 0|1
  index    : number
  moving   : 0|1
  myself   : boolean
  nick     : PlayerDTO['nick']
  side     : SIDES
  sprite   : HTMLImageElement
  speed    : number
  tileSize : number
  x        : number
  y        : number
  setMyself              : () => void
  addKeyboardListener    : () => void
  removeKeyboardListener : () => void
  startMove              : (side : SIDES) => void
  moveTick               : () => void
  moves                  : { [key in SIDES] : () => void }
  onMove                 : (dto : MoveDTO) => void
  stopMove               : (side : SIDES) => void
  tick                   : () => void
  animate                : (DATA : Animation) => { sx : number, sy : number }
  render                 : (context : CanvasRenderingContext2D) => void
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

export function PlayerFactory (props : PlayerProps) : Player {
  // @ts-expect-error
  const player : Player = {
    anim: {
      frameCurrent: 0, lastRender: 0, sum: true
    },
    holding: 0,
    index: props.index,
    moving: 0,
    myself: false,
    nick: props.nick,
    side: 'D',
    speed: props.speed,
    tileSize: 16,
    x: props.x,
    y: props.y,
    sprite: new Image()
  }
  player.sprite.src = `/sprites/chars/${props.sprite}.png`
  player.setMyself = setMyself.bind(player)
  player.addKeyboardListener = addKeyboardListener.bind(player)
  player.removeKeyboardListener = removeKeyboardListener.bind(player)
  player.startMove = startMove.bind(player)
  player.moveTick = moveTick.bind(player)
  player.moves = { D: moveDown.bind(player), L: moveLeft.bind(player), R: moveRight.bind(player), U: moveUp.bind(player) }
  player.onMove = onMove.bind(player)
  player.stopMove = stopMove.bind(player)
  player.tick = tick.bind(player)
  player.animate = animate.bind(player)
  player.render = render.bind(player)
  return player
}

function setMyself (this : Player) {
  this.myself = true
}

function addKeyboardListener (this : Player) {
  document.addEventListener('keydown', keydownListener.bind(this))
  document.addEventListener('keyup', keyupListener.bind(this))
}

function removeKeyboardListener (this : Player) {
  document.removeEventListener('keydown', keydownListener.bind(this))
  document.removeEventListener('keyup', keyupListener.bind(this))
}

function keydownListener (this : Player, event : KeyboardEvent) {
  event.preventDefault()
  const key = event.key.toUpperCase()
  if (MOVE_KEYS[key]) this.startMove(MOVE_KEYS[key])
}

function keyupListener (this : Player, event : KeyboardEvent) {
  event.preventDefault()
  const key = event.key.toUpperCase()
  if (MOVE_KEYS[key]) this.stopMove(MOVE_KEYS[key])
}

function startMove (this : Player, side : SIDES) {
  MOVING[side] = true
  this.side = side
  this.moving = 1
}

function moveTick (this : Player) {
  if (!this.moving) return
  this.moves[this.side]()
  if (!this.myself) return
  const dto:MoveDTO = { h:this.holding, i:this.index, m:this.moving, s:this.side, x:this.x, y:this.y }
  socket.emit('mv', dto)
}

function moveDown (this : Player) {
  this.y += this.speed
}

function moveUp (this : Player) {
  this.y -= this.speed
}

function moveRight (this : Player) {
  this.x += this.speed
}

function moveLeft (this : Player) {
  this.x -= this.speed
}

function onMove (this : Player, dto : MoveDTO) {
  this.holding = dto.h
  this.moving = dto.m
  this.side = dto.s
  this.x = dto.x
  this.y = dto.y
}

function stopMove (this : Player, side : SIDES) {
  MOVING[side] = false
  this.moving = 0
  for (const side in MOVING) {
    if (MOVING[side as SIDES]) {
      this.side = side as SIDES
      this.moving = 1
      break
    }
  }
  const dto:MoveDTO = { h:this.holding, i:this.index, m:this.moving, s:this.side, x:this.x, y:this.y }
  socket.emit('mv', dto)
}

function tick (this : Player) {
  this.moveTick()
}

function animate (this : Player, DATA : Animation) {
  const currentTime = Date.now()
  if (currentTime - this.anim.lastRender > DATA.ANIM_INTERVAL) {
    if (this.anim.frameCurrent === DATA.FRAME_END) {
      this.anim.sum = false
    }
    else if (this.anim.frameCurrent === DATA.FRAME_START) {
      this.anim.sum = true
    }
    this.anim.sum ? this.anim.frameCurrent++ : this.anim.frameCurrent--
    this.anim.lastRender = currentTime
  }
  return {
    sx: this.anim.frameCurrent * DATA.FRAME_WIDTH,
    sy: DATA.COLUMN * DATA.FRAME_HEIGHT
  }
}

function render (this : Player, context : CanvasRenderingContext2D) {
  if (this.side === 'D') {
    if (this.holding) {
      if (this.moving) {
        const { sx, sy } = this.animate(PLAYER_DH)
        context.drawImage(this.sprite, sx, sy, PLAYER_DH.FRAME_WIDTH, PLAYER_DH.FRAME_HEIGHT, this.x, this.y, PLAYER_DH.FRAME_WIDTH, PLAYER_DH.FRAME_HEIGHT)
      }
      else {
        context.drawImage(this.sprite, PLAYER_DH.FRAME_WIDTH*4, PLAYER_DH.COLUMN, PLAYER_DH.FRAME_WIDTH, PLAYER_DH.FRAME_HEIGHT, this.x, this.y, PLAYER_DH.FRAME_WIDTH, PLAYER_DH.FRAME_HEIGHT)
      }
    }
    else if (this.moving) {
      const { sx, sy } = this.animate(PLAYER_D)
      context.drawImage(this.sprite, sx, sy, PLAYER_D.FRAME_WIDTH, PLAYER_D.FRAME_HEIGHT, this.x, this.y, PLAYER_D.FRAME_WIDTH, PLAYER_D.FRAME_HEIGHT)
    }
    else {
      context.drawImage(this.sprite, PLAYER_D.FRAME_WIDTH, PLAYER_D.COLUMN, PLAYER_D.FRAME_WIDTH, PLAYER_D.FRAME_HEIGHT, this.x, this.y, PLAYER_D.FRAME_WIDTH, PLAYER_D.FRAME_HEIGHT)
    }
  }
  else if (this.side === 'U') {
    if (this.holding) {
      if (this.moving) {
        const { sx, sy } = this.animate(PLAYER_UH)
        context.drawImage(this.sprite, sx, sy, PLAYER_UH.FRAME_WIDTH, PLAYER_UH.FRAME_HEIGHT, this.x, this.y, PLAYER_UH.FRAME_WIDTH, PLAYER_UH.FRAME_HEIGHT)
      }
      else {
        context.drawImage(this.sprite, PLAYER_UH.FRAME_WIDTH*4, PLAYER_UH.FRAME_HEIGHT, PLAYER_UH.FRAME_WIDTH, PLAYER_UH.FRAME_HEIGHT, this.x, this.y, PLAYER_UH.FRAME_WIDTH, PLAYER_UH.FRAME_HEIGHT)
      }
    }
    else if (this.moving) {
      const { sx, sy } = this.animate(PLAYER_U)
      context.drawImage(this.sprite, sx, sy, PLAYER_U.FRAME_WIDTH, PLAYER_U.FRAME_HEIGHT, this.x, this.y, PLAYER_U.FRAME_WIDTH, PLAYER_U.FRAME_HEIGHT)
    }
    else {
      context.drawImage(this.sprite, PLAYER_U.FRAME_WIDTH, PLAYER_U.FRAME_HEIGHT, PLAYER_U.FRAME_WIDTH, PLAYER_U.FRAME_HEIGHT, this.x, this.y, PLAYER_U.FRAME_WIDTH, PLAYER_U.FRAME_HEIGHT)
    }
  }
  else if (this.side === 'R') {
    if (this.holding) {
      if (this.moving) {
        const { sx, sy } = this.animate(PLAYER_RH)
        context.drawImage(this.sprite, sx, sy, PLAYER_RH.FRAME_WIDTH, PLAYER_RH.FRAME_HEIGHT, this.x, this.y, PLAYER_RH.FRAME_WIDTH, PLAYER_RH.FRAME_HEIGHT)
      }
      else {
        context.drawImage(this.sprite, PLAYER_RH.FRAME_WIDTH*4, PLAYER_RH.FRAME_HEIGHT*PLAYER_RH.COLUMN, PLAYER_RH.FRAME_WIDTH, PLAYER_RH.FRAME_HEIGHT, this.x, this.y, PLAYER_RH.FRAME_WIDTH, PLAYER_RH.FRAME_HEIGHT)
      }
    }
    else if (this.moving) {
      const { sx, sy } = this.animate(PLAYER_R)
      context.drawImage(this.sprite, sx, sy, PLAYER_R.FRAME_WIDTH, PLAYER_R.FRAME_HEIGHT, this.x, this.y, PLAYER_R.FRAME_WIDTH, PLAYER_R.FRAME_HEIGHT)
    }
    else {
      context.drawImage(this.sprite, PLAYER_R.FRAME_WIDTH, PLAYER_R.FRAME_HEIGHT*PLAYER_R.COLUMN, PLAYER_R.FRAME_WIDTH, PLAYER_R.FRAME_HEIGHT, this.x, this.y, PLAYER_R.FRAME_WIDTH, PLAYER_R.FRAME_HEIGHT)
    }
  }
  else {
    if (this.holding) {
      if (this.moving) {
        const { sx, sy } = this.animate(PLAYER_LH)
        context.drawImage(this.sprite, sx, sy, PLAYER_LH.FRAME_WIDTH, PLAYER_LH.FRAME_HEIGHT, this.x, this.y, PLAYER_LH.FRAME_WIDTH, PLAYER_LH.FRAME_HEIGHT)
      }
      else {
        context.drawImage(this.sprite, PLAYER_LH.FRAME_WIDTH*4, PLAYER_LH.FRAME_HEIGHT*PLAYER_LH.COLUMN, PLAYER_LH.FRAME_WIDTH, PLAYER_LH.FRAME_HEIGHT, this.x, this.y, PLAYER_LH.FRAME_WIDTH, PLAYER_LH.FRAME_HEIGHT)
      }
    }
    else if (this.moving) {
      const { sx, sy } = this.animate(PLAYER_L)
      context.drawImage(this.sprite, sx, sy, PLAYER_L.FRAME_WIDTH, PLAYER_L.FRAME_HEIGHT, this.x, this.y, PLAYER_L.FRAME_WIDTH, PLAYER_L.FRAME_HEIGHT)
    }
    else {
      context.drawImage(this.sprite, PLAYER_L.FRAME_WIDTH, PLAYER_L.FRAME_HEIGHT*PLAYER_L.COLUMN, PLAYER_L.FRAME_WIDTH, PLAYER_L.FRAME_HEIGHT, this.x, this.y, PLAYER_L.FRAME_WIDTH, PLAYER_L.FRAME_HEIGHT)
    }
  }
}