import { JoinRoomDTO } from '#/dto'
import { ERRORS } from '#/errors'
import { errorHandler } from '~/services/errorHandler'
import socket from '~/services/socket'
import store from '~/store'

export function joinRoom () {
  if (document.readyState === 'complete') {
    const dto:JoinRoomDTO = {fillRoom:store.getState().options.fillRoom!}
    socket.emit('join_room', dto)
  }
  else {
    errorHandler(ERRORS.PAGE_LOADING)
  }
}