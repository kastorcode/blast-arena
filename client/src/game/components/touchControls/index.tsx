import { Action, Down, Left, Right, Up } from './assets'
import { ActionContainer, Container, HorizontalControls, MoveContainer, VerticalControls } from './style'

interface TouchControlsProps {
  isPortrait : boolean
}

const KEYDOWN_EVENTS = {
  ACTION: new KeyboardEvent('keydown', {key:' '}),
  DOWN: new KeyboardEvent('keydown', {key:'S'}),
  LEFT: new KeyboardEvent('keydown', {key:'A'}),
  RIGHT: new KeyboardEvent('keydown', {key:'D'}),
  UP: new KeyboardEvent('keydown', {key:'W'})
}

const KEYUP_EVENTS = {
  DOWN: new KeyboardEvent('keyup', {key:'S'}),
  LEFT: new KeyboardEvent('keyup', {key:'A'}),
  RIGHT: new KeyboardEvent('keyup', {key:'D'}),
  UP: new KeyboardEvent('keyup', {key:'W'})
}

export default function TouchControls ({isPortrait}:TouchControlsProps) {
  return (
    <Container isPortrait={isPortrait}>
      <MoveContainer>
        <VerticalControls>
          <Up
            onTouchStart={() => document.dispatchEvent(KEYDOWN_EVENTS.UP)}
            onTouchEnd={() => document.dispatchEvent(KEYUP_EVENTS.UP)}
          />
          <Down
            onTouchStart={() => document.dispatchEvent(KEYDOWN_EVENTS.DOWN)}
            onTouchEnd={() => document.dispatchEvent(KEYUP_EVENTS.DOWN)}
          />
        </VerticalControls>
        <HorizontalControls>
          <Left
            onTouchStart={() => document.dispatchEvent(KEYDOWN_EVENTS.LEFT)}
            onTouchEnd={() => document.dispatchEvent(KEYUP_EVENTS.LEFT)}
          />
          <Right
            onTouchStart={() => document.dispatchEvent(KEYDOWN_EVENTS.RIGHT)}
            onTouchEnd={() => document.dispatchEvent(KEYUP_EVENTS.RIGHT)}
          />
        </HorizontalControls>
      </MoveContainer>
      <ActionContainer>
        <Action onTouchStart={() => document.dispatchEvent(KEYDOWN_EVENTS.ACTION)} />
      </ActionContainer>
    </Container>
  )
}