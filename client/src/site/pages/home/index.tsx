import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useOutlet } from 'react-router-dom'
import { LobbyDTO } from '#/dto'
import GameApp from '~/game/components/gameApp'
import Lobby from '~/site/components/lobby'
import Menu from '~/site/components/menu'
import Options from '~/site/components/options'
import SiteApp from '~/site/components/siteApp'
import { isInternetSlow } from '~/site/util/net'
import { Container } from './style'

export default function HomePage () {

  const lobby = useSelector<any,LobbyDTO|null>(state => state.lobby)
  const outlet = useOutlet()
  const [showGame, setShowGame] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  function GetPage () {
    if (outlet) return (
      <Outlet/>
    )
    if (showOptions) return (
      <Options setShowOptions={setShowOptions} />
    )
    if (lobby) return (
      <Lobby lobby={lobby} setShowGame={setShowGame} setShowOptions={setShowOptions} />
    )
    return null
  }

  useEffect(() => {
    if (!containerRef.current || isInternetSlow()) return
    containerRef.current!.style.backgroundImage = 'url(/images/bg/0.jpg)'
  })

  return (
    <SiteApp>
      { showGame ? (
        <GameApp setShowGame={setShowGame} />
      ) : (
        <Container ref={containerRef}>
          {!showOptions && <Menu/>}
          <GetPage/>
        </Container>
      )}
    </SiteApp>
  )

}