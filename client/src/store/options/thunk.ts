import { Dispatch } from 'redux'
import store from '~/store'
import { setOptions } from './actions'
import { dto } from './reducer'

const KEY = 'options'

export function bootOptions (dispatch:Dispatch) {
  const options = loadOptions()
  if (options) {
    dispatch(setOptions(options))
  }
}

export function loadOptions () {
  const item = localStorage.getItem(KEY)
  if (!item) return null
  const parsed = JSON.parse(item)
  const options = {...dto}
  Object.keys(dto).forEach(key => {
    // @ts-ignore
    if (parsed[key] !== undefined) options[key] = parsed[key]
  })
  return options
}

export function saveOptions () {
  localStorage.setItem(KEY, JSON.stringify(store.getState().options))
}