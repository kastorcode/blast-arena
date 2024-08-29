interface Action {
  type     : string
  payload ?: OptionsDTO
}

export interface OptionsDTO {
  touchControls : boolean
}

export const dto:OptionsDTO = {
  touchControls: false
}

export default function optionsReducer (state=dto, action:Action) {
  switch (action.type) {
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