import { Server } from 'socket.io'
import { onFlingBomb, onHoldBomb, onKill, onMove, onMoveBomb, onNullifyBlock, onPlaceBomb } from '~/game'
import { changeLobby, createLobby, exitPairing, joinRoom, onDisconnect, setUser } from '~/manager'

export default function ioListener (io:Server) {

  io.on('connection', socket => {

    socket.on('set_user',     user => setUser(io, socket, user))
    socket.on('create_lobby', () => createLobby(io, socket))
    socket.on('change_lobby', lobbyId => changeLobby(io, socket, lobbyId))
    socket.on('join_room',    dto => joinRoom(io, socket, dto))
    socket.on('exit_pairing', () => exitPairing(socket))
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
    socket.on('mb', dto => onMoveBomb(io, socket, dto))
    socket.on('hb', dto => onHoldBomb(io, socket, dto))
    socket.on('fb', dto => onFlingBomb(io, socket, dto))
    socket.on('nb', dto => onNullifyBlock(io, socket, dto))
    socket.on('kl', dto => onKill(io, socket, dto))

  })

}