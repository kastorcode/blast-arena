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
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
`

export const FormContainer = styled.div`
  & > *:not(:last-child) {
    margin-bottom: 1.5rem;
  }
`