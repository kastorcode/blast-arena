import { Blocks } from './block'
import { Entities } from './factory'
import { Stage } from './stage'

export interface GameState {
  blast    : number
  blocks   : Blocks
  bomb     : number
  entities : Entities
  stage    : Stage
}