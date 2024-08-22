export type SIDES = 'U'|'L'|'D'|'R' // player side: up, left, down, right

export interface BlockDTO {
  b ?: number  // bonus item id
  t  : 'D'|'I' // block type: desctructible or indestructible
  x  : number  // block x position
  y  : number  // block y position
}

export interface FlingBombDTO {
  i : string // bomb id
  p : number // player index
  s : SIDES  // bomb side
  x : number // player x position
  y : number // player y position
}

export interface GameStateDTO {
  blast  : number
  blocks : (BlockDTO|null)[][]
  bomb   : number
  bonus  : number
  stage  : number
}

export interface HoldBombDTO {
  i : string // bomb id
  p : number // player index
}

export interface KillDTO {
  p : number // player index
}

export interface LobbyDTO {
  lobbyId : string
  players : UserDTO[]
}

export interface MoveBombDTO {
  i : string // bomb id
  p : number // player index
  s : SIDES  // bomb side
}

export interface MoveDTO {
  h : 0|1    // if player is holding
  m : 0|1    // if player is moving
  p : number // player index
  s : SIDES  // player side
  x : number // player x position
  y : number // player y position
}

export interface NullifyBlockDTO {
  a : [number, number] // block axes
}

export interface PlaceBombDTO {
  a : [number, number] // bomb axes
  i : string           // bomb id
  p : number           // player index
  r : number           // bomb reach
  x : number           // bomb x position
  y : number           // bomb y position
}

export interface PlayerDTO extends UserDTO {
  sprite : number
}

export interface StartGameDTO {
  players : PlayerDTO[]
  state   : GameStateDTO
}

export interface UserDTO {
  nick : string|null
}