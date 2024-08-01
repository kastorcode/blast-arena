export function MaxPlayersError () {
  return new Error('MAX_PLAYERS_REACHED')
}

export function PlayerNotFoundError () {
  return new Error('PLAYER_NOT_FOUND')
}