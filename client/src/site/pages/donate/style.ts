import styled from 'styled-components'

export const Container = styled.div`
  align-items: center;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  padding: 2rem;
  width: 100%;
  > h1 {
    margin-bottom: 1rem;
  }
`

export const PayContainer = styled.div<{isPortrait:boolean}>`
  display: flex;
  flex-direction: ${({isPortrait}) => isPortrait ? 'column' : 'row'};
  div {
    align-items: center;
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  div div {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 1rem;
    width: 100%;
  }
  h1 {
    margin: 0;
  }
  img {
    margin-bottom: 1rem;
    max-width: 256px;
    width: 100%;
  }
  svg {
    margin-right: 0.5rem;
  }
  & > *:not(:last-child) {
    margin-bottom: ${({isPortrait}) => isPortrait ? '1rem' : 0};
    margin-right: ${({isPortrait}) => isPortrait ? 0 : '2rem'};
  }
`