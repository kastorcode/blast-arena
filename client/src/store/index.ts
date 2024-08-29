import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import lobbyReducer from '~/store/lobby/reducer'
import optionsReducer from '~/store/options/reducer'
import userReducer from '~/store/user/reducer'

const rootReducer = combineReducers({
  lobby: lobbyReducer,
  options: optionsReducer,
  user: userReducer
})

export default configureStore({
  reducer: rootReducer
})