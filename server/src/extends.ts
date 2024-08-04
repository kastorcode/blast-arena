import { Socket as SocketIO } from 'socket.io'
import { PlayerDTO } from '~/dto'

export interface Socket extends SocketIO {
  data : PlayerDTO
}