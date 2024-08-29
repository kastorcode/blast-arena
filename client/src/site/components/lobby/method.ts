import { JoinRoomDTO } from '#/dto'
import socket from '~/services/socket'
import store from '~/store'

export function copyToClipboard (text:string) {
  return navigator.clipboard.writeText(text)
}

export function joinRoom () {
  const dto:JoinRoomDTO = {
    fillRoom: store.getState().options.fillRoom!
  }
  socket.emit('join_room', dto)
}