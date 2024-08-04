import { Server } from 'socket.io'
import { LobbyDTO } from '#/dto'
import { Socket } from '~/extends'

export function updateLobbyFactory (io : Server, socket : Socket) : LobbyDTO|null {
  const lobby = io.sockets.adapter.rooms.get(socket.data.lobbyId)
  if (!lobby) return null
  const players:LobbyDTO['players'] = []
  for (const socketId of lobby) {
    const player:Socket|undefined = io.sockets.sockets.get(socketId)
    if (!player) continue
    players.push({
      nick: player.data.nick
    })
  }
  if (players.length) {
    return {
      lobbyId: socket.data.lobbyId,
      players
    }
  }
  return null
}