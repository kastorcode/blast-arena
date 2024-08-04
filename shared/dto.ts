export interface LobbyDTO {
  lobbyId : string
  players : Array<{nick : string}>
}

export interface UserDTO {
  nick : string|null
}