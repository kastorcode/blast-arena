import { Server } from 'socket.io'
import { INITIAL_POSITION, SPEED, SPRITES, STAGES } from '#/constants'
import { GameStateDTO, LobbyDTO, SquareDTO, StartGameDTO } from '#/dto'
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
  const squares = squaresFactory()
  const state = stateFactory()
  states[roomId] = state
  return {
    players, squares, stage, state
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

function squaresFactory () : (SquareDTO|null)[][] {
  const removal = [3,2,3,2,3,2,3,2,3,2,3]
  const squares:(SquareDTO|null)[][] = [
    [null, null, {b:0,x:48,y:16}, {b:0,x:64,y:16}, {b:0,x:80,y:16}, {b:0,x:96,y:16}, {b:0,x:112,y:16}, {b:0,x:128,y:16}, {b:0,x:144,y:16}, {b:0,x:160,y:16}, {b:0,x:176,y:16}, null, null],
    [null, null, {b:0,x:48,y:32}, null, {b:0,x:80,y:32}, null, {b:0,x:112,y:32}, null, {b:0,x:144,y:32}, null, {b:0,x:176,y:32}, null, null],
    [{b:0,x:16,y:48}, {b:0,x:32,y:48}, {b:0,x:48,y:48}, {b:0,x:64,y:48}, {b:0,x:80,y:48}, {b:0,x:96,y:48}, {b:0,x:112,y:48}, {b:0,x:128,y:48}, {b:0,x:144,y:48}, {b:0,x:160,y:48}, {b:0,x:176,y:48}, {b:0,x:192,y:48}, {b:0,x:208,y:48}],
    [{b:0,x:16,y:64}, null, {b:0,x:48,y:64}, null, {b:0,x:80,y:64}, null, {b:0,x:112,y:64}, null, {b:0,x:144,y:64}, null, {b:0,x:176,y:64}, null, {b:0,x:208,y:64}],
    [{b:0,x:16,y:80}, {b:0,x:32,y:80}, {b:0,x:48,y:80}, {b:0,x:64,y:80}, {b:0,x:80,y:80}, {b:0,x:96,y:80}, {b:0,x:112,y:80}, {b:0,x:128,y:80}, {b:0,x:144,y:80}, {b:0,x:160,y:80}, {b:0,x:176,y:80}, {b:0,x:192,y:80}, {b:0,x:208,y:80}],
    [{b:0,x:16,y:96}, null, {b:0,x:48,y:96}, null, {b:0,x:80,y:96}, null, {b:0,x:112,y:96}, null, {b:0,x:144,y:96}, null, {b:0,x:176,y:96}, null, {b:0,x:208,y:96}],
    [{b:0,x:16,y:112}, {b:0,x:32,y:112}, {b:0,x:48,y:112}, {b:0,x:64,y:112}, {b:0,x:80,y:112}, {b:0,x:96,y:112}, {b:0,x:112,y:112}, {b:0,x:128,y:112}, {b:0,x:144,y:112}, {b:0,x:160,y:112}, {b:0,x:176,y:112}, {b:0,x:192,y:112}, {b:0,x:208,y:112}],
    [{b:0,x:16,y:128}, null, {b:0,x:48,y:128}, null, {b:0,x:80,y:128}, null, {b:0,x:112,y:128}, null, {b:0,x:144,y:128}, null, {b:0,x:176,y:128}, null, {b:0,x:208,y:128}],
    [{b:0,x:16,y:144}, {b:0,x:32,y:144}, {b:0,x:48,y:144}, {b:0,x:64,y:144}, {b:0,x:80,y:144}, {b:0,x:96,y:144}, {b:0,x:112,y:144}, {b:0,x:128,y:144}, {b:0,x:144,y:144}, {b:0,x:160,y:144}, {b:0,x:176,y:144}, {b:0,x:192,y:144}, {b:0,x:208,y:144}],
    [null, null, {b:0,x:48,y:160}, null, {b:0,x:80,y:160}, null, {b:0,x:112,y:160}, null, {b:0,x:144,y:160}, null, {b:0,x:176,y:160}, null, null],
    [null, null, {b:0,x:48,y:176}, {b:0,x:64,y:176}, {b:0,x:80,y:176}, {b:0,x:96,y:176}, {b:0,x:112,y:176}, {b:0,x:128,y:176}, {b:0,x:144,y:176}, {b:0,x:160,y:176}, {b:0,x:176,y:176}, null, null]
  ]
  for (let i = 0; i < removal.length; i++) {
    for (let j = 0; j < removal[i]; j++) {
      const where = Math.floor(Math.random() * squares[i].length)
      if (!squares[i][where]) {
        j--
        continue
      }
      squares[i][where] = null
    }
  }
  return squares
}

function stateFactory () : GameStateDTO {
  return {
    positions: INITIAL_POSITION,
    speed: SPEED
  }
}