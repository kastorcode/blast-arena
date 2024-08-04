import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import lobbyReducer from '~/store/lobby/reducer'
import userReducer from '~/store/user/reducer'

const rootReducer = combineReducers({
  lobby: lobbyReducer,
  user: userReducer
})

export default configureStore({
  reducer: rootReducer
})