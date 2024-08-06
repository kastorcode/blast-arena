import { GameStateDTO } from '#/dto'

type ROOM_ID = string

interface States {
  [key : ROOM_ID] : GameStateDTO
}

export const states : States = {}