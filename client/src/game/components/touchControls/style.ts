import styled from 'styled-components'

export const ActionContainer = styled.div`
  height: 100%;
  max-height: 96px;
  max-width: 96px;
  width: 100%;
`

export const Container = styled.div<{isPortrait:boolean}>`
  align-items: center;
  bottom: ${({isPortrait}) => isPortrait ? '10%' : 'auto'};
  display: flex;
  fill: #fff;
  height: 100%;
  justify-content: space-between;
  max-height: 192px;
  opacity: 50%;
  padding: 0 2%;
  position: absolute;
  width: 100%;
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

export const MoveContainer = styled.div`
  height: 100%;
  max-width: 192px;
  position: relative;
  width: 100%;
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