import { Server } from 'socket.io'
import { KillDTO, MoveDTO, NullifyBlockDTO, PlaceBombDTO } from '#/dto'
import { Socket } from '~/extends'

export function onMove (io:Server, socket:Socket, dto:MoveDTO) {
  dto.i = socket.data.index
  io.to(socket.data.roomId).emit('mv', dto)
}

export function onPlaceBomb (io:Server, socket:Socket, dto:PlaceBombDTO) {
  dto.i = socket.data.index
  io.to(socket.data.roomId).emit('pb', dto)
}

export function onNullifyBlock (io:Server, socket:Socket, dto:NullifyBlockDTO) {
  io.to(socket.data.roomId).emit('nb', dto)
}

export function onKill (io:Server, socket:Socket, dto:KillDTO) {
  dto.i = socket.data.index
  io.to(socket.data.roomId).emit('kl', dto)
}