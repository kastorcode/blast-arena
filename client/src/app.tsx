import '~/index.css'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { UserDTO } from '#/dto'
import GameApp from '~/game/components/App'
import randomuser from '~/game/services/randomuser'
import socket from '~/game/services/socket'
import useBoot from '~/hooks/useBoot'
import { updateLobby } from '~/store/lobby/actions'
import { setUserNick } from '~/store/user/actions'
import { saveUser } from '~/store/user/thunk'

export default function App () {

  const dispatch = useDispatch()
  const booting = useBoot(dispatch)
  const user = useSelector<any,UserDTO>(state => state.user)

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
    socket.on('error', console.error)
    socket.on('update_lobby', lobby => dispatch(updateLobby(lobby)))
    return () => {
      socket.off('error', console.error)
      socket.off('update_lobby', lobby => dispatch(updateLobby(lobby)))
    }
  }, [])

  return (
    <GameApp />
  )

}