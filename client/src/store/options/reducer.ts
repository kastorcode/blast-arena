interface Action {
  type     : string
  payload ?: OptionsDTO
}

export interface OptionsDTO {
  fillRoom      : boolean
  touchControls : boolean
}

export const dto:OptionsDTO = {
  fillRoom: true,
  touchControls: false
}

export default function optionsReducer (state=dto, action:Action) {
  switch (action.type) {
    case 'SET_FILL_ROOM': return {
      ...state,
      fillRoom: !state.fillRoom
    }
    case 'SET_OPTIONS': return {
      ...action.payload
    }
    case 'SET_TOUCH_CONTROLS': return {
      ...state,
      touchControls: !state.touchControls
    }
    default: return state
  }
}