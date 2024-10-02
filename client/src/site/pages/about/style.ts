import styled from 'styled-components'

export const AuthorContainer = styled.div<{isPortrait:boolean}>`
  display: flex;
  flex-direction: ${({isPortrait}) => isPortrait ? 'column' : 'row'};
  width: 100%;
  > div {
    align-items: center;
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 255px;
    padding: 1rem;
  }
  > :nth-child(1) {
    background-color: #7159c1;
  }
  > :nth-child(2) {
    background-color: #e34c0f;
  }
  > div > div {
    align-items: center;
    display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  img {
    max-width: 192px;
    width: 75%;
  }
`

export const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`

export const Footer = styled.div`
  align-items: center;
  background-color: #000;
  display: flex;
  justify-content: center;
  padding: 1rem;
  width: 100%;
`

export const GameContainer = styled.div`
  align-items: center;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  min-height: 255px;
  padding: 1rem;
  width: 100%;
  div {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: auto;
    margin-bottom: 1rem;
    max-width: 288px;
    width: 100%;
  }
  img {
    max-width: 100%;
  }
  svg {
    fill: #fff;
    width: 33%;
  }
`