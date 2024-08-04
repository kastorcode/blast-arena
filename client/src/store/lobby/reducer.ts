import { LobbyDTO } from '#/dto'

interface Action {
  type    : string
  payload : LobbyDTO
}

export const dto : LobbyDTO|null = null

export default function lobbyReducer (state = dto, action : Action) {
  switch (action.type) {
    case 'UPDATE_LOBBY': return {
      ...action.payload
    }
    default: return state
  }
}