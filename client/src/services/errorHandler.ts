import { toast, ToastOptions } from 'react-toastify'
import { ERRORS } from '#/errors'
import { BASENAME } from '~/constants'

const toastOptions:ToastOptions = {
  autoClose: 3000,
  theme: 'colored'
}

const darkOptions:ToastOptions = {
  ...toastOptions,
  theme: 'dark'
}

const notCloseOptions:ToastOptions = {
  ...toastOptions,
  autoClose: false
}

const handler:{[key:string]:Function|undefined} = {
  [ERRORS.ALREADY_IN_LOBBY]: () => {
    toast.warn('You are already in this lobby', darkOptions)
  },
  [ERRORS.ALREADY_PAIRING]: () => {
    toast.warn('Lobby is already pairing', darkOptions)
  },
  [ERRORS.CREATE_LOBBY_FAILED]: () => {
    toast.error('Failed to create lobby', notCloseOptions)
  },
  [ERRORS.CREATE_ROOM_FAILED]: () => {
    toast.error('Failed to create room', notCloseOptions)
  },
  [ERRORS.LOBBY_FULL]: () => {
    toast.info('The lobby is full', darkOptions)
    redirectToHomePage()
  },
  [ERRORS.LOBBY_NOT_FOUND]: () => {
    toast.error('Lobby not found', toastOptions)
    redirectToHomePage()
  },
  [ERRORS.PAGE_LOADING]: () => {
    toast.error('The page is loading', toastOptions)
  },
  [ERRORS.SET_USER_FAILED]: () => {
    toast.error('Failed to update user', toastOptions)
  }
}

function redirectToHomePage () {
  setTimeout(() => {
    window.location.href = BASENAME
  }, toastOptions.autoClose as number)
}

export function errorHandler (error:number) {
  const fn = handler[error]
  if (fn) fn()
  else    console.error(error)
}