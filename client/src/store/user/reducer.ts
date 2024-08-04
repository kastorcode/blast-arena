import { UserDTO } from '#/dto'

interface Action {
  type    : string
  payload : string|UserDTO
}

export const dto : UserDTO = {
  nick: null
}

export default function userReducer (state = dto, action : Action) {
  switch (action.type) {
    case 'SET_USER': return {
      ...action.payload as UserDTO
    }
    case 'SET_USER_NICK': return {
      ...state,
      nick: action.payload
    }
    default: return state
  }
}