import { Blocks } from './block'
import { Entities } from './factory'

export interface GameState {
  blocks   : Blocks
  bomb     : number
  entities : Entities
}