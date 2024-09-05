import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LobbyDTO } from '#/dto'
import { copyToClipboard } from '~/services/clipboard'
import socket from '~/services/socket'
import OnlinePlayers from '~/site/components/onlinePlayers'
import Toggle from '~/site/components/toggle'
import { setFillRoom } from '~/store/options/actions'
import { OptionsDTO } from '~/store/options/reducer'
import { joinRoom } from './method'
import { Container, LobbyContainer, LobbyId, Options, OptionsContainer, Play, PlayContainer, PlayBorder, Player, PlayersContainer } from './style'

interface LobbyProps {
  lobby          : LobbyDTO
  setShowGame    : React.Dispatch<React.SetStateAction<boolean>>
  setShowOptions : React.Dispatch<React.SetStateAction<boolean>>
}

export default function Lobby ({ lobby, setShowGame, setShowOptions } : LobbyProps) {

  const options = useSelector<any,OptionsDTO>(state => state.options)
  const dispatch = useDispatch()

  function handleOpenGame () {
    socket.off('open_game', handleOpenGame)
    setShowGame(true)
  }

  useEffect(() => {
    socket.on('open_game', handleOpenGame)
    return () => {
      socket.off('open_game', handleOpenGame)
    }
  })

  return (
    <Container>
      <PlayContainer>
        <PlayBorder onClick={joinRoom}><Play>Play!</Play></PlayBorder>
        <Toggle on={options.fillRoom} onClick={() => dispatch(setFillRoom())}>Fill Room</Toggle>
        <OnlinePlayers/>
      </PlayContainer>
      <LobbyContainer>
        <OptionsContainer>
          <LobbyId onClick={() => copyToClipboard(lobby.lobbyId)}>{lobby.lobbyId}</LobbyId>
          <Options onClick={() => setShowOptions(true)}>Options</Options>
        </OptionsContainer>
        <PlayersContainer>
          {lobby.players.map((p,i) => (
            <Player key={`${i}${p.nick}`}>{p.nick}</Player>
          ))}
        </PlayersContainer>
      </LobbyContainer>
    </Container>
  )

}