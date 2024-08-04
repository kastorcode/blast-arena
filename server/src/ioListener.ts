import { Server } from 'socket.io'
import { setUser, createLobby, changeLobby, joinRoom } from '~/ioHelper'

export default function ioListener (io : Server) {

  io.on('connection', socket => {
    socket.on('set_user',     user => setUser(user, io, socket))
    socket.on('create_lobby', () => createLobby(io, socket))
    socket.on('change_lobby', lobbyId => changeLobby(lobbyId, io, socket))
    socket.on('join_room',    () => joinRoom(io, socket))
    ondev(() => {
      socket.onAny(event => {
        if (socket.eventNames().includes(event)) return
        const error = `${event} not found`
        console.error(error)
        socket.emit('error', error)
      })
    })
  })

}