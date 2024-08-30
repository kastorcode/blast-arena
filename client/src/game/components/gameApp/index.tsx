import { useSelector } from 'react-redux'
import Canvas from '~/game/components/canvas'
import TouchControls from '~/game/components/touchControls'
import useIsPortrait from '~/hooks/useIsPortrait'
import { OptionsDTO } from '~/store/options/reducer'
import { Container } from './style'

export default function GameApp () {

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

  return (
    <Container>
      {options.touchControls && <TouchControls isPortrait={isPortrait} />}
      <Canvas style={getCanvasStyle()} />
    </Container>
  )

}