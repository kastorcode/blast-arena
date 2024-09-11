import { useRef } from 'react'
import { SIDES } from '#/dto'
import { Action, Down, Left, Right, Up } from './assets'
import { ActionContainer, Container, ControlsContainer, HorizontalControls, MoveContainer, VerticalControls } from './style'

interface TouchControlsProps {
  isPortrait : boolean
}

const KEYDOWN_EVENTS = {
  A: new KeyboardEvent('keydown', {key:' '}),
  D: new KeyboardEvent('keydown', {key:'S'}),
  L: new KeyboardEvent('keydown', {key:'A'}),
  R: new KeyboardEvent('keydown', {key:'D'}),
  U: new KeyboardEvent('keydown', {key:'W'})
}

const KEYUP_EVENTS = {
  D: new KeyboardEvent('keyup', {key:'S'}),
  L: new KeyboardEvent('keyup', {key:'A'}),
  R: new KeyboardEvent('keyup', {key:'D'}),
  U: new KeyboardEvent('keyup', {key:'W'})
}

export default function TouchControls ({isPortrait}:TouchControlsProps) {

  const touch = useRef<{side:SIDES,startX:number,startY:number}>({
    side:'D', startX:0, startY:0
  })

  function onTouchStart (event:React.TouchEvent<HTMLDivElement|SVGSVGElement>, side:SIDES) {
    const {clientX, clientY} = event.touches[0]
    touch.current.side = side
    touch.current.startX = clientX
    touch.current.startY = clientY
    document.dispatchEvent(KEYDOWN_EVENTS[side])
  }

  function onTouchMove (event:React.TouchEvent<HTMLDivElement>) {
    const {clientX, clientY} = event.touches[0]
    const {side, startX, startY} = touch.current
    const deltaX = clientX - startX
    const deltaY = clientY - startY
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        if (side !== 'R') {
          document.dispatchEvent(KEYUP_EVENTS[side])
          document.dispatchEvent(KEYDOWN_EVENTS.R)
          touch.current.side = 'R'
        }
      }
      else {
        if (side !== 'L') {
          document.dispatchEvent(KEYUP_EVENTS[side])
          document.dispatchEvent(KEYDOWN_EVENTS.L)
          touch.current.side = 'L'
        }
      }
    }
    else {
      if (deltaY > 0) {
        if (side !== 'D') {
          document.dispatchEvent(KEYUP_EVENTS[side])
          document.dispatchEvent(KEYDOWN_EVENTS.D)
          touch.current.side = 'D'
        }
      }
      else {
        if (side !== 'U') {
          document.dispatchEvent(KEYUP_EVENTS[side])
          document.dispatchEvent(KEYDOWN_EVENTS.U)
          touch.current.side = 'U'
        }
      }
    }
  }

  return (
    <Container>
      <MoveContainer
        isPortrait={isPortrait}
        onTouchStart={e => onTouchStart(e, touch.current.side)}
        onTouchMove={onTouchMove}
        onTouchEnd={() => document.dispatchEvent(KEYUP_EVENTS[touch.current.side])}
      >
        <ControlsContainer>
          <VerticalControls>
            <Up
              onTouchStart={e => onTouchStart(e, 'U')}
              onTouchEnd={() => document.dispatchEvent(KEYUP_EVENTS.U)}
            />
            <Down
              onTouchStart={e => onTouchStart(e, 'D')}
              onTouchEnd={() => document.dispatchEvent(KEYUP_EVENTS.D)}
            />
          </VerticalControls>
          <HorizontalControls>
            <Left
              onTouchStart={e => onTouchStart(e, 'L')}
              onTouchEnd={() => document.dispatchEvent(KEYUP_EVENTS.L)}
            />
            <Right
              onTouchStart={e => onTouchStart(e, 'R')}
              onTouchEnd={() => document.dispatchEvent(KEYUP_EVENTS.R)}
            />
          </HorizontalControls>
        </ControlsContainer>
      </MoveContainer>
      <ActionContainer isPortrait={isPortrait}>
        <Action onTouchStart={() => document.dispatchEvent(KEYDOWN_EVENTS.A)} />
      </ActionContainer>
    </Container>
  )

}