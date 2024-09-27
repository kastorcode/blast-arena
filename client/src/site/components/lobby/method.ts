import { ERRORS } from '#/errors'
import { errorHandler } from '~/services/errorHandler'
import { emitJoinRoom } from '~/services/socket'
import store from '~/store'

export function joinRoom () {
  if (document.readyState === 'complete') {
    emitJoinRoom({fillRoom:store.getState().options.fillRoom!})
  }
  else {
    errorHandler(ERRORS.PAGE_LOADING)
  }
}