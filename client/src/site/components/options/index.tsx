import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { ID_LENGTH, NICK } from '#/constants'
import { setUserNick } from '~/store/user/actions'
import { submitChangeLobby } from './method'
import { CloseOptions, Container, FormContainer } from './style'

interface OptionsProps {
  setShowOptions : React.Dispatch<React.SetStateAction<boolean>>
}

export default function Options ({ setShowOptions } : OptionsProps) {

  const lobbyIdRef = useRef<HTMLInputElement>(null)
  const nickRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()

  function handleChangeLobby (event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { value } = lobbyIdRef.current!
    if (!value || value.length !== ID_LENGTH) return
    setShowOptions(false)
    submitChangeLobby(value)
  }

  function handleChangeNick (event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { value } = nickRef.current!
    if (!value || value.length < NICK.MIN || value.length > NICK.MAX) return
    setShowOptions(false)
    dispatch(setUserNick(value))
  }

  useEffect(() => {
    lobbyIdRef.current!.focus()
  })

  return (
    <Container>
      <CloseOptions onClick={() => setShowOptions(false)}>Close</CloseOptions>
      <FormContainer>
        <form onSubmit={handleChangeLobby}>
          <input ref={lobbyIdRef} type='text' placeholder='lobby id' maxLength={ID_LENGTH} minLength={ID_LENGTH} />
          <input type='submit' value='Join' />
        </form>
        <form onSubmit={handleChangeNick}>
          <input ref={nickRef} type='text' placeholder='new nick' maxLength={NICK.MAX} minLength={NICK.MIN} />
          <input type='submit' value='Replace' />
        </form>
      </FormContainer>
    </Container>
  )

}