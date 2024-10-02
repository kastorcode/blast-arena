import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useOutlet } from 'react-router-dom'
import { LobbyDTO } from '#/dto'
import GameApp from '~/game/components/gameApp'
import { socket } from '~/services/socket'
import Lobby from '~/site/components/lobby'
import Menu from '~/site/components/menu'
import Options from '~/site/components/options'
import SiteApp from '~/site/components/siteApp'
import { Container } from './style'

export default function HomePage () {

  const lobby = useSelector<any,LobbyDTO|null>(state => state.lobby)
  const outlet = useOutlet()
  const [showGame, setShowGame] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  function handleOpenGame () {
    socket.off('open_game', handleOpenGame)
    setShowGame(true)
  }

  function GetPage () {
    if (outlet) return (
      <Outlet/>
    )
    if (showOptions) return (
      <Options setShowOptions={setShowOptions} />
    )
    if (lobby) return (
      <Lobby lobby={lobby} setShowOptions={setShowOptions} />
    )
    return null
  }

  useEffect(() => {
    socket.on('open_game', handleOpenGame)
    return () => {
      socket.off('open_game', handleOpenGame)
    }
  })

  return (
    <SiteApp>
      { showGame ? (
        <GameApp setShowGame={setShowGame} />
      ) : (
        <Container>
          {!showOptions && <Menu/>}
          <GetPage/>
        </Container>
      )}
    </SiteApp>
  )

}