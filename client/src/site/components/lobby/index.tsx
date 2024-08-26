import { useEffect } from 'react'
import { LobbyDTO } from '#/dto'
import socket from '~/services/socket'
import { copyToClipboard, joinRoom } from './method'
import { ChangeLobby, Container, LobbyContainer, LobbyId, Play, PlayBorder, Player, Players } from './style'

interface LobbyProps {
  lobby              : LobbyDTO
  setShowChangeLobby : React.Dispatch<React.SetStateAction<boolean>>
  setShowGame        : React.Dispatch<React.SetStateAction<boolean>>
}

export default function Lobby ({ lobby, setShowChangeLobby, setShowGame } : LobbyProps) {

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
        <ChangeLobby onClick={() => setShowChangeLobby(true)}>Change Lobby</ChangeLobby>
      </LobbyContainer>
      <Players>
        {lobby.players.map(p => (
          <Player>{p.nick}</Player>
        ))}
      </Players>
    </Container>
    </>
  )

}