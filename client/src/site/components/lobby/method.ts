import { JoinRoomDTO } from '#/dto'
import socket from '~/services/socket'
import store from '~/store'

export function joinRoom () {
  const dto:JoinRoomDTO = {
    fillRoom: store.getState().options.fillRoom!
  }
  socket.emit('join_room', dto)
}