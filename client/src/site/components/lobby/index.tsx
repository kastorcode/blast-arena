import { useEffect } from 'react'
import { LobbyDTO } from '#/dto'
import socket from '~/services/socket'
import { copyToClipboard, joinRoom } from './method'
import { Container, LobbyContainer, LobbyId, Options, Play, PlayBorder, Player, Players } from './style'

interface LobbyProps {
  lobby          : LobbyDTO
  setShowGame    : React.Dispatch<React.SetStateAction<boolean>>
  setShowOptions : React.Dispatch<React.SetStateAction<boolean>>
}

export default function Lobby ({ lobby, setShowGame, setShowOptions } : LobbyProps) {

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
    <>
    <PlayBorder onClick={joinRoom}><Play>Play!</Play></PlayBorder>
    <Container>
      <LobbyContainer>
        <LobbyId onClick={() => copyToClipboard(lobby.lobbyId)}>{lobby.lobbyId}</LobbyId>
        <Options onClick={() => setShowOptions(true)}>Options</Options>
      </LobbyContainer>
      <Players>
        {lobby.players.map((p,i) => (
          <Player key={`${i}${p.nick}`}>{p.nick}</Player>
        ))}
      </Players>
    </Container>
    </>
  )

}