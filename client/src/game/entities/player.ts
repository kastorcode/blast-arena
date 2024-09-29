import { PRESS_INTERVAL, TILE_SIZE } from '#/constants'
import { MoveDTO, PlayerDTO, SIDES } from '#/dto'
import { animate, AnimControl } from '~/game/animations/animation'
import { PLAYER_D, PLAYER_DH, PLAYER_K, PLAYER_L, PLAYER_LH, PLAYER_R, PLAYER_RH, PLAYER_U, PLAYER_UH } from '~/game/animations/player'
import { Bomb, BombFactory } from '~/game/entities/bomb'
import { GamepadFactory } from '~/game/entities/gamepad'
import { GameState } from '~/game/entities/state'
import { playBombSound } from '~/game/sound/bomb'
import { playKillSound } from '~/game/sound/kill'
import { emitFlingBomb, emitHoldBomb, emitKill, emitMove, emitPlaceBomb } from '~/services/socket'

interface LastPress {
  bomb : number
}

interface PlayerProps extends PlayerDTO {
  index : number
  speed : number
  x     : number
  y     : number
}

export interface Player {
  active     : boolean
  anim       : AnimControl['anim']
  bombId     : string
  bombKeys   : {[key:string]:'B'}
  bombReach  : number
  bombs      : number
  collidable : boolean
  hold       : boolean
  holding    : 0|1
  index      : number
  kick       : boolean
  lastPress  : LastPress
  moveKeys   : {[key:string]:SIDES}
  moving     : 0|1
  movingSide : {[key in SIDES]:boolean}
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
  removeInputListener  : () => void
  onVisibilityChange   : () => void
  keydownListener      : (event:KeyboardEvent) => void
  keyupListener        : (event:KeyboardEvent) => void
  removeGamepadSupport : () => void
  addGamepadSupport    : () => void
  startMove            : (side:SIDES) => void
  moveTick             : (state:GameState) => void
  moves                : {[key in SIDES] : () => void}
  onMove               : (dto:MoveDTO) => void
  stopMove             : (side:SIDES) => void
  invertControls       : () => void
  handleBomb           : (state:GameState) => void
  placeBomb            : (state:GameState) => void
  holdBomb             : (state:GameState) => void
  flingBomb            : (state:GameState) => void
  kill                 : (emit:boolean) => void
  tick                 : (state:GameState) => void
  render               : (context:CanvasRenderingContext2D) => void
}

export function PlayerFactory (props:PlayerProps) : Player {
  const player : Player = {
    active: false,
    anim: {frameCurrent:0, lastRender:0, sum:true},
    bombKeys: {
      'Z': 'B',
      'X': 'B',
      'C': 'B',
      ' ': 'B'
    },
    bombReach: 2,
    bombs: 1,
    collidable: true,
    hold: false,
    holding: 0,
    index: props.index,
    kick: false,
    lastPress: {bomb:0},
    moveKeys: {
      'W': 'U',
      'A': 'L',
      'S': 'D',
      'D': 'R',
      'ARROWUP': 'U',
      'ARROWLEFT': 'L',
      'ARROWDOWN': 'D',
      'ARROWRIGHT': 'R'
    },
    moving: 0,
    movingSide: {U:false, L:false, D:false, R:false},
    myself: false,
    nick: props.nick,
    side: 'D',
    speed: props.speed,
    x: props.x,
    y: props.y,
    sprite: new Image()
  } as unknown as Player
  player.sprite.src = `${process.env.PUBLIC_URL}/sprites/chars/${props.sprite}.png`
  player.setMyself = setMyself.bind(player)
  player.getAxes = getAxes.bind(player)
  player.addInputListener = addInputListener.bind(player)
  player.removeInputListener = removeInputListener.bind(player)
  player.startMove = startMove.bind(player)
  player.moveTick = moveTick.bind(player)
  player.moves = {D:moveDown.bind(player), L:moveLeft.bind(player), R:moveRight.bind(player), U:moveUp.bind(player)}
  player.onMove = onMove.bind(player)
  player.stopMove = stopMove.bind(player)
  player.invertControls = invertControls.bind(player)
  player.handleBomb = handleBomb.bind(player)
  player.placeBomb = placeBomb.bind(player)
  player.holdBomb = holdBomb.bind(player)
  player.flingBomb = flingBomb.bind(player)
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
  this.onVisibilityChange = () => onVisibilityChange.call(this)
  document.addEventListener('visibilitychange', this.onVisibilityChange)
  this.keydownListener = event => keydownListener.call(this, event, state)
  document.addEventListener('keydown', this.keydownListener)
  this.keyupListener = event => keyupListener.call(this, event)
  document.addEventListener('keyup', this.keyupListener)
  this.removeGamepadSupport = () => removeGamepadSupport.call(this, state)
  window.addEventListener('gamepaddisconnected', this.removeGamepadSupport)
  this.addGamepadSupport = () => addGamepadSupport.call(this, state)
  window.addEventListener('gamepadconnected', this.addGamepadSupport)
  this.addGamepadSupport()
}

function removeInputListener (this:Player) {
  document.removeEventListener('visibilitychange', this.onVisibilityChange)
  document.removeEventListener('keydown', this.keydownListener)
  document.removeEventListener('keyup', this.keyupListener)
  window.removeEventListener('gamepaddisconnected', this.removeGamepadSupport)
  window.removeEventListener('gamepadconnected', this.addGamepadSupport)
}

function onVisibilityChange (this:Player) {
  if (document.hidden && this.active) this.kill(true)
}

function keydownListener (this:Player, event:KeyboardEvent, state:GameState) {
  event.preventDefault()
  if (!this.active) return
  const key = event.key.toUpperCase()
  if (this.moveKeys[key]) {
    this.startMove(this.moveKeys[key])
  }
  if (this.bombKeys[key]) {
    if (Date.now() > this.lastPress.bomb) {
      this.lastPress.bomb = Date.now() + PRESS_INTERVAL
      this.handleBomb(state)
    }
  }
}

function keyupListener (this:Player, event:KeyboardEvent) {
  event.preventDefault()
  if (!this.active) return
  const key = event.key.toUpperCase()
  if (this.moveKeys[key]) this.stopMove(this.moveKeys[key])
}

function addGamepadSupport (this:Player, state:GameState) {
  const index = 0
  const hasGamepad = navigator.getGamepads()[index]
  if (!hasGamepad) return
  const id = `G${this.index}`
  if (state.entities.has(id)) return
  const gamepad = GamepadFactory({id, index, player:this})
  if (this.moveKeys['W'] === 'D') gamepad.invertControls()
  state.entities.add(gamepad)
}

function removeGamepadSupport (this:Player, state:GameState) {
  const gamepad = state.entities.get(`G${this.index}`)
  if (!gamepad) return
  state.entities.remove(gamepad)
}

function startMove (this:Player, side:SIDES) {
  this.movingSide[side] = true
  this.side = side
  this.moving = 1
}

function moveTick (this:Player, state:GameState) {
  if (!this.moving) return
  this.moves[this.side]()
  if (!this.myself) return
  state.blocks.tick(state)
  emitMove({h:this.holding, m:this.moving, p:this.index, s:this.side, x:this.x, y:this.y})
}

function moveDown (this:Player) {
  this.y += this.speed
  if (this.y > 169) {
    if (this.collidable) {
      this.y = 169
      this.moving = 0
    }
    else if (this.y > 175) {
      this.y = 2
    }
  }
}

function moveUp (this:Player) {
  this.y -= this.speed
  if (this.y < 9) {
    if (this.collidable) {
      this.y = 9
      this.moving = 0
    }
    else if (this.y < 2) {
      this.y = 175
    }
  }
}

function moveRight (this:Player) {
  this.x += this.speed
  if (this.x > 209) {
    if (this.collidable) {
      this.x = 209
      this.moving = 0
    }
    else if (this.x > 217) {
      this.x = 7
    }
  }
}

function moveLeft (this:Player) {
  this.x -= this.speed
  if (this.x < 17) {
    if (this.collidable) {
      this.x = 17
      this.moving = 0
    }
    else if (this.x < 7) {
      this.x = 217
    }
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
  this.movingSide[side] = false
  this.moving = 0
  for (const side in this.movingSide) {
    if (this.movingSide[side as SIDES]) {
      this.side = side as SIDES
      this.moving = 1
      break
    }
  }
  emitMove({h:this.holding, m:this.moving, p:this.index, s:this.side, x:this.x, y:this.y})
}

function invertControls (this:Player) {
  this.moveKeys['W'] = 'D'
  this.moveKeys['A'] = 'R'
  this.moveKeys['S'] = 'U'
  this.moveKeys['D'] = 'L'
  this.moveKeys['ARROWUP'] = 'D'
  this.moveKeys['ARROWLEFT'] = 'R'
  this.moveKeys['ARROWDOWN'] = 'U'
  this.moveKeys['ARROWRIGHT'] = 'L'
}

function handleBomb (this:Player, state:GameState) {
  if (this.hold) {
    if (this.holding) {
      this.flingBomb(state)
    }
    else {
      this.holdBomb(state)
    }
  }
  else {
    this.placeBomb(state)
  }
}

function placeBomb (this:Player, state:GameState) {
  if (!this.bombs) return
  const axes = this.getAxes()
  const block = state.blocks.getBlock(axes)
  if (block) return
  this.bombs--
  const bomb = BombFactory({
    axes,
    player     : this,
    playerIndex: this.index,
    reach      : this.bombReach
  })
  state.blocks.putBomb(bomb)
  emitPlaceBomb({
    a: axes,
    i: bomb.id,
    p: bomb.playerIndex,
    r: bomb.reach,
    x: bomb.x,
    y: bomb.y
  })
  state.entities.add(bomb)
  playBombSound()
}

function holdBomb (this:Player, state:GameState) {
  const block = state.blocks.getBlock(this.getAxes())
  if (block && block.t === 'O') {
    this.holding = 1
    this.bombId = block.id
    const bomb = state.entities.get(block.id) as Bomb
    emitHoldBomb({i:bomb.id,p:this.index})
    bomb.setHolding(this.index, state)
  }
  else {
    this.placeBomb(state)
  }
}

function flingBomb (this:Player, state:GameState) {
  this.holding = 0
  const bomb = state.entities.get(this.bombId) as Bomb
  emitFlingBomb({i:bomb.id,p:this.index,s:this.side,x:this.x,y:this.y-9})
  bomb.startFling(this.side)
}

function kill (this:Player, emit:boolean) {
  if (this.removeTime) return
  this.removeTime = Date.now() + 350
  this.active = false
  this.moving = 0
  this.holding = 0
  this.collidable = false
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
  playKillSound()
  if (!emit) return
  this.removeGamepadSupport()
  emitKill({p:this.index})
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