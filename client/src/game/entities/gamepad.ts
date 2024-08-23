import { PRESS_INTERVAL } from '#/constants'
import { SIDES } from '#/dto'
import { Player } from '~/game/entities/player'
import { GameState } from '~/game/entities/state'

interface GamepadProps {
  id     : string
  index  : number
  player : Player
}

interface GamepadHost {
  id     : string
  index  : number
  player : Player
  invertControls : () => void
  tick           : (state:GameState) => void
  render         : () => void
}

const MOVE_KEYS:{[key:number]:SIDES} = {
  12:'U', 14:'L', 13:'D', 15:'R'
}

const BOMB_KEYS:{[key:number]:'B'} = {
  0:'B', 1:'B', 2:'B', 3:'B'
}

const LAST_PRESS:{[key:string]:number} = {
  BOMB:0
}

export function GamepadFactory (props:GamepadProps) : GamepadHost {
  const host:GamepadHost = {
    id: props.id,
    index: props.index,
    player: props.player,
    render: () => {}
  } as GamepadHost
  host.invertControls = invertControls.bind(host)
  host.tick = tick.bind(host)
  return host
}

function tick (this:GamepadHost, state:GameState) {
  const gamepad = navigator.getGamepads()[this.index]
  if (!gamepad) return
  let useAxes = true
  for (const key in MOVE_KEYS) {
    if (gamepad.buttons[key].pressed) {
      this.player.startMove(MOVE_KEYS[key])
      useAxes = false
    }
    else {
      this.player.stopMove(MOVE_KEYS[key])
    }
  }
  if (useAxes) {
    if      (gamepad.axes[1] > 0.3)  this.player.startMove(MOVE_KEYS[13])
    else if (gamepad.axes[1] < -0.3) this.player.startMove(MOVE_KEYS[12])
    else if (gamepad.axes[0] > 0.2)  this.player.startMove(MOVE_KEYS[15])
    else if (gamepad.axes[0] < -0.2) this.player.startMove(MOVE_KEYS[14])
    else                             this.player.stopMove(this.player.side)
  }
  for (const key in BOMB_KEYS) {
    if (gamepad.buttons[key].pressed) {
      if (Date.now() > LAST_PRESS.BOMB) {
        LAST_PRESS.BOMB = Date.now() + PRESS_INTERVAL
        this.player.handleBomb(state)
      }
    }
  }
}

function invertControls () {
  MOVE_KEYS[12] = 'D'
  MOVE_KEYS[14] = 'R'
  MOVE_KEYS[13] = 'U'
  MOVE_KEYS[15] = 'L'
}