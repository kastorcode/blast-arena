import { Server } from 'socket.io'
import { BLASTS, BOMBS, BONUS, BONUSES, SPRITES, STAGES } from '#/constants'
import { BlockDTO, GameStateDTO, LobbyDTO, StartGameDTO } from '#/dto'
import { Socket } from '~/extends'

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
  const state = stateFactory()
  return { players, state }
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
  const blocks = bonusFactory(blocksFactory())
  const blast = Math.floor(Math.random() * BLASTS)
  const bomb = Math.floor(Math.random() * BOMBS)
  const bonus = Math.floor(Math.random() * BONUS)
  const stage = Math.floor(Math.random() * STAGES)
  return {blast, blocks, bomb, bonus, stage}
}

function blocksFactory () : (BlockDTO|null)[][] {
  const removal = [3,2,3,2,3,2,3,2,3,2,3]
  const blocks:(BlockDTO|null)[][] = [
    [null, null, {t:'D',x:48,y:16}, {t:'D',x:64,y:16}, {t:'D',x:80,y:16}, {t:'D',x:96,y:16}, {t:'D',x:112,y:16}, {t:'D',x:128,y:16}, {t:'D',x:144,y:16}, {t:'D',x:160,y:16}, {t:'D',x:176,y:16}, null, null],
    [null, {t:'I',x:32,y:32}, {t:'D',x:48,y:32}, {t:'I',x:64,y:32}, {t:'D',x:80,y:32}, {t:'I',x:96,y:32}, {t:'D',x:112,y:32}, {t:'I',x:128,y:32}, {t:'D',x:144,y:32}, {t:'I',x:160,y:32}, {t:'D',x:176,y:32}, {t:'I',x:192,y:32}, null],
    [{t:'D',x:16,y:48}, {t:'D',x:32,y:48}, {t:'D',x:48,y:48}, {t:'D',x:64,y:48}, {t:'D',x:80,y:48}, {t:'D',x:96,y:48}, {t:'D',x:112,y:48}, {t:'D',x:128,y:48}, {t:'D',x:144,y:48}, {t:'D',x:160,y:48}, {t:'D',x:176,y:48}, {t:'D',x:192,y:48}, {t:'D',x:208,y:48}],
    [{t:'D',x:16,y:64}, {t:'I',x:32,y:64}, {t:'D',x:48,y:64}, {t:'I',x:64,y:64}, {t:'D',x:80,y:64}, {t:'I',x:96,y:64}, {t:'D',x:112,y:64}, {t:'I',x:128,y:64}, {t:'D',x:144,y:64}, {t:'I',x:160,y:64}, {t:'D',x:176,y:64}, {t:'I',x:192,y:64}, {t:'D',x:208,y:64}],
    [{t:'D',x:16,y:80}, {t:'D',x:32,y:80}, {t:'D',x:48,y:80}, {t:'D',x:64,y:80}, {t:'D',x:80,y:80}, {t:'D',x:96,y:80}, {t:'D',x:112,y:80}, {t:'D',x:128,y:80}, {t:'D',x:144,y:80}, {t:'D',x:160,y:80}, {t:'D',x:176,y:80}, {t:'D',x:192,y:80}, {t:'D',x:208,y:80}],
    [{t:'D',x:16,y:96}, {t:'I',x:32,y:96}, {t:'D',x:48,y:96}, {t:'I',x:64,y:96}, {t:'D',x:80,y:96}, {t:'I',x:96,y:96}, {t:'D',x:112,y:96}, {t:'I',x:128,y:96}, {t:'D',x:144,y:96}, {t:'I',x:160,y:96}, {t:'D',x:176,y:96}, {t:'I',x:192,y:96}, {t:'D',x:208,y:96}],
    [{t:'D',x:16,y:112}, {t:'D',x:32,y:112}, {t:'D',x:48,y:112}, {t:'D',x:64,y:112}, {t:'D',x:80,y:112}, {t:'D',x:96,y:112}, {t:'D',x:112,y:112}, {t:'D',x:128,y:112}, {t:'D',x:144,y:112}, {t:'D',x:160,y:112}, {t:'D',x:176,y:112}, {t:'D',x:192,y:112}, {t:'D',x:208,y:112}],
    [{t:'D',x:16,y:128}, {t:'I',x:32,y:128}, {t:'D',x:48,y:128}, {t:'I',x:64,y:128}, {t:'D',x:80,y:128}, {t:'I',x:96,y:128}, {t:'D',x:112,y:128}, {t:'I',x:128,y:128}, {t:'D',x:144,y:128}, {t:'I',x:160,y:128}, {t:'D',x:176,y:128}, {t:'I',x:192,y:128}, {t:'D',x:208,y:128}],
    [{t:'D',x:16,y:144}, {t:'D',x:32,y:144}, {t:'D',x:48,y:144}, {t:'D',x:64,y:144}, {t:'D',x:80,y:144}, {t:'D',x:96,y:144}, {t:'D',x:112,y:144}, {t:'D',x:128,y:144}, {t:'D',x:144,y:144}, {t:'D',x:160,y:144}, {t:'D',x:176,y:144}, {t:'D',x:192,y:144}, {t:'D',x:208,y:144}],
    [null, {t:'I',x:32,y:160}, {t:'D',x:48,y:160}, {t:'I',x:64,y:160}, {t:'D',x:80,y:160}, {t:'I',x:96,y:160}, {t:'D',x:112,y:160}, {t:'I',x:128,y:160}, {t:'D',x:144,y:160}, {t:'I',x:160,y:160}, {t:'D',x:176,y:160}, {t:'I',x:192,y:160}, null],
    [null, null, {t:'D',x:48,y:176}, {t:'D',x:64,y:176}, {t:'D',x:80,y:176}, {t:'D',x:96,y:176}, {t:'D',x:112,y:176}, {t:'D',x:128,y:176}, {t:'D',x:144,y:176}, {t:'D',x:160,y:176}, {t:'D',x:176,y:176}, null, null]
  ]
  for (let i = 0; i < removal.length; i++) {
    for (let j = 0; j < removal[i]; j++) {
      const where = Math.floor(Math.random() * blocks[i].length)
      if (!blocks[i][where] || blocks[i][where]?.t !== 'D') {
        j--
        continue
      }
      blocks[i][where] = null
    }
  }
  return blocks
}

function bonusFactory (blocks:(BlockDTO|null)[][]) : (BlockDTO|null)[][] {
  const positions:number[][] = []
  blocks.forEach((row,i) => row.forEach((block,j) => {
    if (block && block.t === 'D') positions.push([i, j])
  }))
  for (let bonus = 1; bonus < BONUSES.length; bonus++) {
    for (let quantity = BONUSES[bonus]; quantity > 0; quantity--) {
      const where = Math.floor(Math.random() * positions.length)
      blocks[positions[where][0]][positions[where][1]]!.b = bonus as BlockDTO['b']
      positions.splice(where, 1)
    }
  }
  return blocks
}