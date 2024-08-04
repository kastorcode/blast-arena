import { UserDTO } from '#/dto'

export function setUser (user : UserDTO) {
  return { type: 'SET_USER', payload: user }
}

export function setUserNick (nick : string) {
  return { type: 'SET_USER_NICK', payload: nick }
}