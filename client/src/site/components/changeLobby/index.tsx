import { useEffect, useRef } from 'react'
import { ID_LENGTH } from '#/constants'
import { submitChangeLobby } from './method'
import { CloseChangeLobby, Container } from './style'

interface ChangeLobbyProps {
  setShowChangeLobby : React.Dispatch<React.SetStateAction<boolean>>
}

export default function ChangeLobby ({ setShowChangeLobby } : ChangeLobbyProps) {

  const lobbyIdRef = useRef<HTMLInputElement>(null)

  function handleOnSubmit (event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { value } = lobbyIdRef.current!
    if (!value || value.length !== ID_LENGTH) return
    setShowChangeLobby(false)
    submitChangeLobby(value)
  }

  useEffect(() => {
    lobbyIdRef.current!.focus()
  })

  return (
    <Container>
      <CloseChangeLobby onClick={() => setShowChangeLobby(false)}>Close</CloseChangeLobby>
      <form onSubmit={handleOnSubmit}>
        <input ref={lobbyIdRef} type='text' placeholder='lobby id' maxLength={ID_LENGTH} minLength={ID_LENGTH} />
        <input type='submit' value='Join' />
      </form>
    </Container>
  )

}