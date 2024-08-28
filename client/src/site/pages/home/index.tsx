import { useState } from 'react'
import { useSelector } from 'react-redux'
import { LobbyDTO } from '#/dto'
import GameApp from '~/game/components/gameApp'
import Lobby from '~/site/components/lobby'
import Options from '~/site/components/options'
import SiteApp from '~/site/components/siteApp'
import { Container } from './style'

export default function HomePage () {

  const lobby = useSelector<any,LobbyDTO|null>(state => state.lobby)
  const [showGame, setShowGame] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  return (
    <SiteApp>
    { showGame ? (
      <GameApp />
    ) : (
      <Container>
      {showOptions &&
        <Options setShowOptions={setShowOptions} />
      }
      {(lobby && !showOptions) &&
        <Lobby lobby={lobby} setShowGame={setShowGame} setShowOptions={setShowOptions} />
      }
      </Container>
    )}
    </SiteApp>
  )

}