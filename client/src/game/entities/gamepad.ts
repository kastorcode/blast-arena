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
  bombKeys  : {[key:number]:'B'}
  id        : string
  index     : number
  lastPress : LastPress
  moveKeys  : {[key:number]:SIDES}
  player    : Player
  invertControls : () => void
  tick           : (state:GameState) => void
  render         : () => void
}

interface LastPress {
  bomb : number
}

export function GamepadFactory (props:GamepadProps) : GamepadHost {
  const host:GamepadHost = {
    bombKeys: {0:'B', 1:'B', 2:'B', 3:'B'},
    id: props.id,
    index: props.index,
    lastPress: {bomb:0},
    moveKeys: {12:'U', 13:'D', 14:'L', 15:'R'},
    player: props.player,
    render: () => {}
  } as unknown as GamepadHost
  host.invertControls = invertControls.bind(host)
  host.tick = tick.bind(host)
  return host
}

function tick (this:GamepadHost, state:GameState) {
  if (!this.player.active) return
  const gamepad = navigator.getGamepads()[this.index]
  if (!gamepad) return
  let useAxes = true
  for (const key in this.moveKeys) {
    if (gamepad.buttons[key].pressed) {
      this.player.startMove(this.moveKeys[key])
      useAxes = false
    }
    else {
      this.player.stopMove(this.moveKeys[key])
    }
  }
  if (useAxes) {
    if      (gamepad.axes[1] > 0.3)  this.player.startMove(this.moveKeys[13])
    else if (gamepad.axes[1] < -0.3) this.player.startMove(this.moveKeys[12])
    else if (gamepad.axes[0] > 0.2)  this.player.startMove(this.moveKeys[15])
    else if (gamepad.axes[0] < -0.2) this.player.startMove(this.moveKeys[14])
    else                             this.player.stopMove(this.player.side)
  }
  for (const key in this.bombKeys) {
    if (gamepad.buttons[key].pressed) {
      if (Date.now() > this.lastPress.bomb) {
        this.lastPress.bomb = Date.now() + PRESS_INTERVAL
        this.player.handleBomb(state)
      }
    }
  }
}

function invertControls (this:GamepadHost) {
  this.moveKeys[12] = 'D'
  this.moveKeys[13] = 'U'
  this.moveKeys[14] = 'R'
  this.moveKeys[15] = 'L'
}