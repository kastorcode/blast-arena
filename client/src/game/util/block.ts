import { Bomb } from '~/game/entities/bomb'
import { GameState } from '~/game/entities/state'

export function isOnBlock (state:GameState) {
  if (state.players.myself!.collidable) {
    const block = state.blocks.getBlock(state.players.myself!.getAxes())
    if (block) {
      if (block.t === 'D' || block.t === 'I') {
        return true
      }
      if (block.t === 'O') {
        const bomb = state.entities.get(block.id) as Bomb
        bomb.collidable = false
      }
    }
  }
  return false
}