import { OptionsDTO } from './reducer'

export function setFillRoom () {
  return { type: 'SET_FILL_ROOM' }
}

export function setOptions (payload:OptionsDTO) {
  return { type: 'SET_OPTIONS', payload }
}

export function setTouchControls () {
  return { type: 'SET_TOUCH_CONTROLS' }
}