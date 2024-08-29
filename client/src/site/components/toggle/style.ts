import styled from 'styled-components'

export const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  label {
    color: rgb(255,255,0);
    font-weight: 700;
  }
  :hover {
    cursor: pointer;
  }
`

export const Off = styled.span`
  background-color: rgb(255,0,0);
  color: #fff;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
`

export const On = styled.span`
  background-color: rgb(0,255,0);
  color: #fff;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
`