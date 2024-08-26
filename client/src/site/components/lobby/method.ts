import socket from '~/services/socket'

export function copyToClipboard (text:string) {
  return navigator.clipboard.writeText(text)
}

export function joinRoom () {
  socket.emit('join_room')
}