import { Dispatch } from 'redux'
import { UserDTO } from '#/dto'
import { emitSetUser } from '~/services/socket'
import store from '~/store'
import { setUser } from './actions'
import { dto } from './reducer'

const KEY = 'user'

export function bootUser (dispatch:Dispatch) {
  const user = loadUser()
  if (user) {
    emitSetUser(user)
    dispatch(setUser(user))
  }
}

export function deleteUser () {
  localStorage.removeItem(KEY)
}

export function loadUser () {
  const item = localStorage.getItem(KEY)
  if (!item) return null
  const parsed = JSON.parse(item)
  const user:UserDTO = {...dto}
  Object.keys(dto).forEach(key => {
    // @ts-ignore
    if (parsed[key] !== undefined) user[key] = parsed[key]
  })
  return user
}

export function saveUser () {
  localStorage.setItem(KEY, JSON.stringify(store.getState().user))
}