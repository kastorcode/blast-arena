import styled from 'styled-components'

export const Container = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
`

export const LobbyContainer = styled.div`
  align-items: center;
  background-color: rgba(0,0,255,0.8);
  bottom: 1%;
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1024px;
  padding: 0 5%;
  position: absolute;
  transition: 0.2s;
  width: 98%;
  @media (min-width: 1024px) {
    padding: 0 7.5%;
  }
`

export const LobbyId = styled.button`
  background-color: rgba(0,0,0,0);
  padding: 1rem 5%;
  text-align: start;
  width: 53%;
  @media (min-width: 1024px) {
    padding: 1rem 7%;
    width: 81%;
  }
`

export const Options = styled.button`
  background-color: rgba(0,0,0,0);
`

export const OptionsContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`

export const PlayBorder = styled.button`
  background-color: rgb(255,255,0);
  padding: 0.3rem;
`

export const Play = styled.div`
  background-color: rgb(0,0,255);
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
  font-size: 1.5rem;
  padding: 1.5rem;
  transition: 0.2s;
  ${PlayBorder}:hover & {
    background-color: rgb(255,255,0);
    color: rgb(23,11,42);
  }
`

export const PlayContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 192px;
  width: 100%;
  z-index: 1;
  & > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`

export const PlayersContainer = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 1rem 6% 1rem 0;
  width: 100%;
`

export const Player = styled.div``