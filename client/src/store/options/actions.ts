import { OptionsDTO } from './reducer'

export function setCall () {
  return { type: 'SET_CALL' }
}

export function setFillRoom () {
  return { type: 'SET_FILL_ROOM' }
}

export function setFullScreen () {
  return { type: 'SET_FULL_SCREEN' }
}

export function setOptions (payload:OptionsDTO) {
  return { type: 'SET_OPTIONS', payload }
}

export function setTouchControls () {
  return { type: 'SET_TOUCH_CONTROLS' }
}