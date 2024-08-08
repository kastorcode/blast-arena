export type SIDES = 'U'|'L'|'D'|'R'

export interface GameStateDTO {
  positions : number[][]
  speed     : number
}

export interface LobbyDTO {
  lobbyId : string
  players : UserDTO[]
}

export interface MoveDTO {
  h : 0|1     // if player is holding
  i : number  // player index
  m : 0|1     // if player is moving
  s : SIDES   // player side
  x : number  // player x position
  y : number  // player y position
}

export interface PlayerDTO extends UserDTO {
  sprite : number
}

export interface SquareDTO {
  b : number // bonus item id
  x : number // square x position
  y : number // square y position
}

export interface StartGameDTO {
  players : PlayerDTO[]
  squares : (SquareDTO|null)[][]
  stage   : number
  state   : GameStateDTO
}

export interface UserDTO {
  nick : string|null
}