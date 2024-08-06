import { Server } from 'socket.io'
import { INITIAL_POSITION, SPEED, SPRITES, STAGES } from '#/constants'
import { GameStateDTO, LobbyDTO, StartGameDTO } from '#/dto'
import { Socket } from '~/extends'
import { states } from '~/states'

export function startGameFactory (io : Server, roomId : string) : StartGameDTO|null {
  const room = io.sockets.adapter.rooms.get(roomId)
  if (!room) return null
  const players:StartGameDTO['players'] = []
  for (const socketId of room) {
    const p:Socket|undefined = io.sockets.sockets.get(socketId)
    if (!p) continue
    const size = players.push({
      nick: p.data.nick,
      sprite: Math.floor(Math.random() * SPRITES)
    })
    const index = size-1
    p.data.index = index
    p.emit('myself', index)
  }
  if (!players.length) return null
  const stage = Math.floor(Math.random() * STAGES)
  const state = stateFactory()
  states[roomId] = state
  return {
    players, stage, state
  }
}

export function updateLobbyFactory (io : Server, lobbyId : string) : LobbyDTO|null {
  const lobby = io.sockets.adapter.rooms.get(lobbyId)
  if (!lobby) return null
  const players:LobbyDTO['players'] = []
  for (const socketId of lobby) {
    const p:Socket|undefined = io.sockets.sockets.get(socketId)
    if (!p) continue
    players.push({
      nick: p.data.nick
    })
  }
  if (players.length) {
    return {
      lobbyId, players
    }
  }
  return null
}

function stateFactory () : GameStateDTO {
  return {
    positions: INITIAL_POSITION,
    speed: SPEED
  }
}