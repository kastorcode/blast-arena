import { LobbyDTO } from '#/dto'
import { playLobbySound } from '~/game/sound/lobby'
import { addLobbyToUrl } from '~/services/url'

export function updateLobby (lobby:LobbyDTO) {
  playLobbySound()
  addLobbyToUrl(lobby.lobbyId)
  return { type: 'UPDATE_LOBBY', payload: lobby }
}