import { Server } from 'socket.io'
import { MoveDTO } from '#/dto'
import { Socket } from '~/extends'
import { states } from '~/states'

export function onMove (io : Server, socket : Socket, dto : MoveDTO) {
  io.to(socket.data.roomId).emit('mv', dto)
}