import '~/index.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { LobbyDTO, UserDTO } from '#/dto'
import useBoot from '~/hooks/useBoot'
import { CallFactory } from '~/services/call'
import { errorHandler } from '~/services/errorHandler'
import { EVENTS } from '~/services/events'
import randomuser from '~/services/randomuser'
import { emitChangeLobby, emitCreateLobby, emitSetUser, socket } from '~/services/socket'
import { updateLobby } from '~/store/lobby/actions'
import { OptionsDTO } from '~/store/options/reducer'
import { saveOptions } from '~/store/options/thunk'
import { setUserNick } from '~/store/user/actions'
import { saveUser } from '~/store/user/thunk'

interface SiteAppProps {
  children : JSX.Element
}

export default function SiteApp ({ children } : SiteAppProps) {

  const dispatch = useDispatch()
  const booting = useBoot(dispatch)
  const [searchParams] = useSearchParams()
  const lobby = useSelector<any,LobbyDTO|null>(state => state.lobby)
  const options = useSelector<any,OptionsDTO>(state => state.options)
  const user = useSelector<any,UserDTO>(state => state.user)
  const [call] = useState(CallFactory())

  async function initCall () {
    if (call.initiated()) return
    await call.init()
    if (lobby!.players.length > 1) await call.createOffer()
  }

  async function offerCall () {
    if (!call.initiated() || !lobby || lobby.players.length < 2) return
    await call.createOffer()
  }

  function handleLobby () {
    if (lobby) return
    const lobbyParam = searchParams.get('lobby')
    if (lobbyParam) {
      emitChangeLobby(lobbyParam)
    }
    else {
      emitCreateLobby()
    }
  }

  useEffect(() => {
    if (booting || user.nick) return
    randomuser().then(randomnick => {
      dispatch(setUserNick(randomnick))
    })
  }, [booting, user])

  useEffect(() => {
    if (booting || !user) return
    for (const key in user) {
      // @ts-ignore
      if (!user[key]) return
    }
    emitSetUser(user)
    saveUser()
  }, [user])

  useEffect(() => {
    if (booting || !options) return
    saveOptions()
  }, [options])

  useEffect(() => {
    window.addEventListener('load', handleLobby)
    return () => {
      window.removeEventListener('load', handleLobby)
    }
  }, [lobby])

  useEffect(() => {
    if (booting) return
    window.addEventListener(EVENTS.OFFER_CALL, offerCall)
    socket.on('disconnected', call.close)
    socket.on('call_offer', call.onCallOffer)
    socket.on('call_answer', call.onCallAnswer)
    socket.on('ice_candidate', call.onIceCandidate)
    if (options.call && lobby) initCall()
    else                       call.closeAll()
    return () => {
      window.removeEventListener(EVENTS.OFFER_CALL, offerCall)
      socket.off('disconnected', call.close)
      socket.off('call_offer', call.onCallOffer)
      socket.off('call_answer', call.onCallAnswer)
      socket.off('ice_candidate', call.onIceCandidate)
    }
  }, [booting, lobby, options])

  useEffect(() => {
    socket.on('error', errorHandler)
    socket.on('update_lobby', lobby => dispatch(updateLobby(lobby)))
    return () => {
      socket.off('error', errorHandler)
      socket.off('update_lobby', lobby => dispatch(updateLobby(lobby)))
    }
  }, [])

  return children

}