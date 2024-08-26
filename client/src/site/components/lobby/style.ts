import styled from 'styled-components'

export const ChangeLobby = styled.button`
  background-color: rgba(0,0,0,0);
`

export const Container = styled.div`
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

export const LobbyContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
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

export const PlayBorder = styled.button`
  background-color: rgb(255,255,0);
  left: 50%;
  padding: 0.3rem;
  position: absolute;
  translate: -50% -50%;
  top: 50%;
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

export const Players = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-evenly;
  padding: 1rem 6% 1rem 0;
  width: 100%;
`

export const Player = styled.div``