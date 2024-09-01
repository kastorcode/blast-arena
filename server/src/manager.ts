import { Server } from 'socket.io'
import { ID_LENGTH, NICK } from '#/constants'
import { JoinRoomDTO, UserDTO } from '#/dto'
import { MAX_PLAYERS } from '~/constants'
import { Socket } from '~/extends'
import { startGameFactory, updateLobbyFactory } from '~/factory'
import { rooms } from '~/rooms'
import { states } from '~/states'
import { generateId } from '~/util'

export function setUser (io : Server, socket : Socket, user : UserDTO) {
  if (typeof user.nick !== 'string' || user.nick.length < NICK.MIN || user.nick.length > NICK.MAX) {
    return socket.emit('error', 'set_user_failed')
  }
  socket.data.nick = user.nick
  const dto = updateLobbyFactory(io, socket.data.lobbyId)
  if (dto) {
    io.to(socket.data.lobbyId).emit('update_lobby', dto)
  }
}

export function createLobby (io : Server, socket : Socket) {
  const lobbyId = generateId()
  if (io.sockets.adapter.rooms.has(lobbyId)) {
    return socket.emit('error', 'create_lobby_failed')
  }
  return enterLobby(io, socket, lobbyId)
}

export async function changeLobby (io : Server, socket : Socket, lobbyId : string) {
  if (typeof lobbyId !== 'string' || lobbyId.length !== ID_LENGTH) {
    return socket.emit('error', 'lobby_not_found')
  }
  const lobby = io.sockets.adapter.rooms.get(lobbyId)
  if (!lobby) {
    return socket.emit('error', 'lobby_not_found')
  }
  if (lobby.size === MAX_PLAYERS) {
    return socket.emit('error', 'lobby_full')
  }
  if (lobby.has(socket.id)) {
    return socket.emit('error', 'already_in_lobby')
  }
  await enterLobby(io, socket, lobbyId)
}

export async function joinRoom (io:Server, socket:Socket, dto:JoinRoomDTO) {
  if (socket.data.isPairing) {
    return socket.emit('error', 'already_pairing')
  }
  const lobby = io.sockets.adapter.rooms.get(socket.data.lobbyId)
  if (!lobby) {
    return socket.emit('error', 'lobby_not_found')
  }
  io.to(socket.data.lobbyId).emit('open_game')
  const players = getLobbyPlayers(io, lobby)
  if (!dto.fillRoom || players.length === MAX_PLAYERS) {
    return lobbyToRoom(io, socket, players)
  }
  const found = await findRoom(io, players)
  if (!found) {
    return joinRoomQueue(io, socket, players)
  }
}

export function onDisconnect (io : Server, socket : Socket) {
  updateRoomQueue(socket)
  deleteGameState(io, socket)
}

async function enterLobby (io:Server, socket:Socket, lobbyId:string) {
  await socket.leave(socket.data.lobbyId)
  await socket.join(lobbyId)
  socket.data.lobbyId = lobbyId
  const dto = updateLobbyFactory(io, lobbyId)
  if (dto) {
    io.to(lobbyId).emit('update_lobby', dto)
  }
}

function getLobbyPlayers (io : Server, lobby : Set<string>) {
  const players:Socket[] = []
  for (const socketId of lobby) {
    const player:Socket|undefined = io.sockets.sockets.get(socketId)
    if (!player) continue
    player.data.isPairing = true
    players.push(player)
  }
  return players
}

async function lobbyToRoom (io : Server, socket : Socket, players : Socket[]) {
  const roomId = generateId()
  if (io.sockets.adapter.rooms.has(roomId)) {
    return socket.emit('error', 'create_room_failed')
  }
  await enterRoom(roomId, players)
  return io.to(roomId).emit('start_game', startGameFactory(io, roomId))
}

async function enterRoom (roomId : string, players : Socket[]) {
  for (const p of players) {
    await p.leave(p.data.roomId)
    await p.join(roomId)
    p.data.roomId = roomId
  }
}

async function findRoom (io : Server, players : Socket[]) {
  for (let [roomId, size] of rooms) {
    if (size + players.length <= MAX_PLAYERS) {
      if (!rooms.delete(roomId)) continue
      size += players.length
      await enterRoom(roomId, players)
      if (size === MAX_PLAYERS) {
        io.to(roomId).emit('start_game', startGameFactory(io, roomId))
      }
      else {
        rooms.set(roomId, size)
      }
      return true
    }
  }
  return false
}

async function joinRoomQueue (io : Server, socket : Socket, players : Socket[]) {
  const roomId = generateId()
  if (rooms.has(roomId) || io.sockets.adapter.rooms.has(roomId)) {
    return socket.emit('error', 'create_room_failed')
  }
  await enterRoom(roomId, players)
  return rooms.set(roomId, players.length)
}

function updateRoomQueue (socket : Socket) {
  let playersOn = rooms.get(socket.data.roomId)
  if (typeof playersOn !== 'number') return
  playersOn--
  if (playersOn) rooms.set(socket.data.roomId, playersOn)
  else           rooms.delete(socket.data.roomId)
}

function deleteGameState (io : Server, socket : Socket) {
  if (!states[socket.data.roomId]) return
  const room = io.sockets.adapter.rooms.get(socket.data.roomId)
  if (!room || !room.size) delete states[socket.data.roomId]
}

export function exitPairing (socket:Socket) {
  socket.data.isPairing = false
}