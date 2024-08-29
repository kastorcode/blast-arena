import styled from 'styled-components'

export const CloseOptions = styled.button`
  position: absolute;
  right: 1rem;
  top: 1rem;
`

export const Container = styled.div`
  align-items: center;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  position: absolute;
  width: 100%;
`

export const FormContainer = styled.div`
  & > *:not(:last-child) {
    margin-bottom: 1.5rem;
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

export const TouchControlsContainer = styled.div`
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