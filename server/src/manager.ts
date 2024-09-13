import { Server } from 'socket.io'
import { ID_LENGTH, NICK } from '#/constants'
import { DisconnectedDTO, JoinRoomDTO, UserDTO } from '#/dto'
import { ERRORS } from '#/errors'
import { MAX_PLAYERS } from '~/constants'
import { Socket } from '~/extends'
import { startGameFactory, updateLobbyFactory } from '~/factory'
import { rooms } from '~/rooms'
import { generateId } from '~/util'

export function setUser (io:Server, socket:Socket, user:UserDTO) {
  if (typeof user.nick !== 'string' || user.nick.length < NICK.MIN || user.nick.length > NICK.MAX) {
    return socket.emit('error', ERRORS.SET_USER_FAILED)
  }
  socket.data.nick = user.nick
  const dto = updateLobbyFactory(io, socket.data.lobbyId)
  dto && sendToLobby(io, socket, 'update_lobby', dto)
}

export function createLobby (io : Server, socket : Socket) {
  const lobbyId = generateId()
  if (io.sockets.adapter.rooms.has(lobbyId)) {
    return socket.emit('error', ERRORS.CREATE_LOBBY_FAILED)
  }
  return enterLobby(io, socket, lobbyId)
}

export async function changeLobby (io : Server, socket : Socket, lobbyId : string) {
  if (typeof lobbyId !== 'string' || lobbyId.length !== ID_LENGTH) {
    return socket.emit('error', ERRORS.LOBBY_NOT_FOUND)
  }
  const lobby = io.sockets.adapter.rooms.get(lobbyId)
  if (!lobby) {
    return socket.emit('error', ERRORS.LOBBY_NOT_FOUND)
  }
  if (lobby.size === MAX_PLAYERS) {
    return socket.emit('error', ERRORS.LOBBY_FULL)
  }
  if (lobby.has(socket.id)) {
    return socket.emit('error', ERRORS.ALREADY_IN_LOBBY)
  }
  await enterLobby(io, socket, lobbyId)
}

export async function joinRoom (io:Server, socket:Socket, dto:JoinRoomDTO) {
  const lobby = io.sockets.adapter.rooms.get(socket.data.lobbyId)
  if (!lobby) {
    return socket.emit('error', ERRORS.LOBBY_NOT_FOUND)
  }
  for (const socketId of lobby) {
    const s = io.sockets.sockets.get(socketId) as Socket
    if (s.data.isPairing) {
      return socket.emit('error', ERRORS.ALREADY_PAIRING)
    }
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

export function onReady (io:Server, socket:Socket) {
  io.to(socket.data.roomId).emit('ready')
}

export function onDisconnect (io:Server, socket:Socket) {
  updateRoomQueue(socket)
  const dto = updateLobbyFactory(io, socket.data.lobbyId)
  if (dto) {
    const dis:DisconnectedDTO = {socketId:socket.id}
    sendToLobby(io, socket, 'disconnected', dis)
    sendToLobby(io, socket, 'update_lobby', dto)
  }
}

async function enterLobby (io:Server, socket:Socket, lobbyId:string) {
  await socket.leave(socket.data.lobbyId)
  await socket.join(lobbyId)
  socket.data.lobbyId = lobbyId
  const dto = updateLobbyFactory(io, lobbyId)
  dto && sendToLobby(io, socket, 'update_lobby', dto)
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
    return socket.emit('error', ERRORS.CREATE_ROOM_FAILED)
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
    return socket.emit('error', ERRORS.CREATE_ROOM_FAILED)
  }
  await enterRoom(roomId, players)
  return rooms.set(roomId, players.length)
}

function updateRoomQueue (socket:Socket) {
  let playersOn = rooms.get(socket.data.roomId)
  if (typeof playersOn !== 'number') return
  playersOn--
  if (playersOn) rooms.set(socket.data.roomId, playersOn)
  else           rooms.delete(socket.data.roomId)
}

export function exitPairing (socket:Socket) {
  updateRoomQueue(socket)
  socket.data.isPairing = false
}

export function sendToLobby (io:Server, socket:Socket, event:string, dto:any) {
  io.to(socket.data.lobbyId).emit(event, dto)
}