import { Server } from 'socket.io'
import { onKill, onMove, onPlaceBomb } from '~/game'
import { setUser, createLobby, changeLobby, joinRoom, onDisconnect } from '~/manager'

export default function ioListener (io : Server) {

  io.on('connection', socket => {

    socket.on('set_user',     user => setUser(io, socket, user))
    socket.on('create_lobby', () => createLobby(io, socket))
    socket.on('change_lobby', lobbyId => changeLobby(io, socket, lobbyId))
    socket.on('join_room',    () => joinRoom(io, socket))
    socket.on('disconnect',   () => onDisconnect(io, socket))

    ondev(() => {
      socket.onAny(event => {
        if (socket.eventNames().includes(event)) return
        const error = `${event} not found`
        console.error(error)
        socket.emit('error', error)
      })
    })

    socket.on('mv', dto => onMove(io, socket, dto))
    socket.on('pb', dto => onPlaceBomb(io, socket, dto))
    socket.on('kl', dto => onKill(io, socket, dto))

  })

}