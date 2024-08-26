import '~/index.css'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LobbyDTO, UserDTO } from '#/dto'
import useBoot from '~/hooks/useBoot'
import randomuser from '~/services/randomuser'
import socket from '~/services/socket'
import { updateLobby } from '~/store/lobby/actions'
import { setUserNick } from '~/store/user/actions'
import { saveUser } from '~/store/user/thunk'

interface SiteAppProps {
  children : JSX.Element
}

export default function SiteApp ({ children } : SiteAppProps) {

  const dispatch = useDispatch()
  const booting = useBoot(dispatch)
  const user = useSelector<any,UserDTO>(state => state.user)
  const lobby = useSelector<any,LobbyDTO|null>(state => state.lobby)

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
    socket.emit('set_user', user)
    saveUser()
  }, [user])

  useEffect(() => {
    if (lobby) return
    socket.emit('create_lobby')
  }, [lobby])

  useEffect(() => {
    socket.on('error', console.error)
    socket.on('update_lobby', lobby => dispatch(updateLobby(lobby)))
    return () => {
      socket.off('error', console.error)
      socket.off('update_lobby', lobby => dispatch(updateLobby(lobby)))
    }
  }, [])

  return children

}