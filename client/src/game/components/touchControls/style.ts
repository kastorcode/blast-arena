import styled from 'styled-components'

export const ActionContainer = styled.div<{isPortrait:boolean}>`
  bottom: ${({isPortrait}) => isPortrait ? '15%' : 'auto'};
  height: 100%;
  max-height: 96px;
  max-width: 96px;
  position: absolute;
  right: 4%;
  width: 100%;
`

export const Container = styled.div`
  align-items: center;
  display: flex;
  fill: #fff;
  height: 100%;
  justify-content: center;
  left: 0;
  opacity: 50%;
  position: absolute;
  top: 0;
  width: 100%;
`

export const ControlsContainer = styled.div`
  height: 192px;
  position: relative;
  width: 192px;
`

export const HorizontalControls = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 50%;
  translate: 0 -50%;
  width: 100%;
  & > :nth-child(1) {
    margin-right: 2px;
  }
`

export const MoveContainer = styled.div<{isPortrait:boolean}>`
  align-items: ${({isPortrait}) => isPortrait ? 'flex-end' : 'center'};
  display: flex;
  height: 100%;
  justify-content: ${({isPortrait}) => isPortrait ? 'center' : 'flex-start'};
  left: 0;
  min-width: 50%;
  padding-bottom: ${({isPortrait}) => isPortrait ? '15%' : '0'};
  padding-left: ${({isPortrait}) => isPortrait ? '0' : '2%'};
  position: absolute;
  top: 0;
`

export const VerticalControls = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  left: 50%;
  position: absolute;
  top: 50%;
  translate: -50% -50%;
  & > :nth-child(1) {
    margin-bottom: 2px;
  }
`