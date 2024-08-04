import { LobbyDTO } from '#/dto'

export function updateLobby (lobby : LobbyDTO) {
  return { type: 'UPDATE_LOBBY', payload: lobby }
}