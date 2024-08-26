import { useState } from 'react'
import { useSelector } from 'react-redux'
import { LobbyDTO } from '#/dto'
import GameApp from '~/game/components/gameApp'
import ChangeLobby from '~/site/components/changeLobby'
import Lobby from '~/site/components/lobby'
import SiteApp from '~/site/components/siteApp'
import { Container } from './style'

export default function HomePage () {

  const lobby = useSelector<any,LobbyDTO|null>(state => state.lobby)
  const [showChangeLobby, setShowChangeLobby] = useState(false)
  const [showGame, setShowGame] = useState(false)

  return (
    <SiteApp>
    { showGame ? (
      <GameApp />
    ) : (
      <Container>
      {showChangeLobby &&
        <ChangeLobby setShowChangeLobby={setShowChangeLobby} />
      }
      {(lobby && !showChangeLobby) &&
        <Lobby lobby={lobby} setShowChangeLobby={setShowChangeLobby} setShowGame={setShowGame} />
      }
      </Container>
    )}
    </SiteApp>
  )

}