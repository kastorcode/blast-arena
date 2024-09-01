import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Canvas from '~/game/components/canvas'
import TouchControls from '~/game/components/touchControls'
import useIsPortrait from '~/hooks/useIsPortrait'
import socket from '~/services/socket'
import { OptionsDTO } from '~/store/options/reducer'
import { Back } from './assets'
import { ButtonsContainer, Container } from './style'

interface GameAppProps {
  setShowGame : React.Dispatch<React.SetStateAction<boolean>>
}

export default function GameApp ({setShowGame}:GameAppProps) {

  const isPortrait = useIsPortrait()
  const options = useSelector<any,OptionsDTO>(state => state.options)

  function getCanvasStyle () {
    const style:React.CSSProperties = {}
    if (isPortrait) {
      style.width = '100svw'
    }
    else {
      style.height = '100svh'
    }
    if (options.touchControls) {
      if (isPortrait) {
        style.alignSelf = 'flex-start'
        style.marginTop = '10%'
      }
    }
    return style
  }

  useEffect(() => {
    return () => {
      socket.emit('exit_pairing')
    }
  }, [])

  return (
    <Container>
      {options.touchControls && <TouchControls isPortrait={isPortrait} />}
      <ButtonsContainer>
        <Back onClick={() => setShowGame(false)}/>
      </ButtonsContainer>
      <Canvas style={getCanvasStyle()} />
    </Container>
  )

}