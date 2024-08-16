import { Blocks } from './block'
import { Entities } from './factory'
import { Players } from './players'
import { Stage } from './stage'

export interface GameState {
  blast    : number
  blocks   : Blocks
  bomb     : number
  bonus    : number
  entities : Entities
  players  : Players
  stage    : Stage
}