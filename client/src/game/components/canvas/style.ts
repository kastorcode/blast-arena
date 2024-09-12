import styled from 'styled-components'

export const Pairing = styled.div`
  left: 50%;
  position: absolute;
  top: 50%;
  translate: -50% -50%;
`

export const Players = styled.div`
  left: 1%;
  position: absolute;
  top: 1%;
  p {
    font-size: 0.5rem;
    line-height: 1rem;
    margin: 0;
  }
`

export const Timer = styled.div`
  position: absolute;
  right: calc(3% + 24px);
  top: 2%;
`