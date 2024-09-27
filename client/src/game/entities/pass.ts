import { GameState } from '~/game/entities/state'
import { isOnBlock } from '~/game/util/block'

interface PassProps {
  state : GameState
}

interface Pass {
  id         : string
  removeTime : number
  tick   : (state:GameState) => void
  render : () => void
}

export function PassFactory (props:PassProps) : Pass {
  props.state.players.myself!.collidable = false
  const pass:Pass = {
    id: `P${Math.floor(Math.random() * 9999999)}`,
    render: () => {}
  } as Pass
  pass.tick = tick.bind(pass)
  pass.removeTime = Date.now() + 6000
  return pass
}

function tick (this:Pass, state:GameState) {
  if (Date.now() > this.removeTime) {
    state.entities.remove(this)
    state.players.myself!.collidable = true
    if (isOnBlock(state)) {
      state.players.myself!.kill(true)
    }
  }
}