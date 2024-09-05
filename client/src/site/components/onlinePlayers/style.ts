import styled from 'styled-components'

export const Container = styled.div<{loading:boolean}>`
  background-color: rgb(0,0,255);
  opacity: ${({loading}) => loading ? 0.5 : 1};
  padding: 0.25rem 0.5rem;
  position: relative;
  transition: 0.2s;
  width: fit-content;
  z-index: 1;
  &:hover {
    background-color: rgb(255,255,0);
    color: rgb(0,0,255);
    cursor: pointer;
  }
`