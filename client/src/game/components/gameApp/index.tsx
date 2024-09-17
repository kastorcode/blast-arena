import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Canvas from '~/game/components/canvas'
import TouchControls from '~/game/components/touchControls'
import useIsPortrait from '~/hooks/useIsPortrait'
import socket from '~/services/socket'
import { rootElement } from '~/site/view/elements'
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
        style.marginTop = '20%'
      }
    }
    return style
  }

  function handleBackButton (event:PopStateEvent) {
    event.preventDefault()
    setShowGame(false)
  }

  function preventDefault (event:TouchEvent) {
    return event.preventDefault()
  }

  useEffect(() => {
    document.addEventListener('touchmove', preventDefault, {passive:false})
    window.addEventListener('popstate', handleBackButton, {passive:false})
    if (options.fullScreen) {
      rootElement.requestFullscreen()
    }
    return () => {
      socket.emit('exit_pairing')
      document.removeEventListener('touchmove', preventDefault)
      window.removeEventListener('popstate', handleBackButton)
    }
  }, [])

  return (
    <Container>
      {options.touchControls && <TouchControls isPortrait={isPortrait} />}
      <ButtonsContainer>
        <Back onClick={() => setShowGame(false)}/>
      </ButtonsContainer>
      <Canvas style={getCanvasStyle()} setShowGame={setShowGame} />
    </Container>
  )

}