import socket from '~/services/socket'

export function submitChangeLobby (lobbyId:string) {
  socket.emit('change_lobby', lobbyId)
}