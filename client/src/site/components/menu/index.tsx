import { useNavigate } from 'react-router-dom'
import { PAGES } from '~/constants'
import { Container } from './style'

export default function Menu () {

  const navigate = useNavigate()

  return (
    <Container>
      <button onClick={() => navigate(PAGES.HOME)}>Home</button>
      <button onClick={() => navigate(PAGES.DONATE)}>Donate</button>
      <button onClick={() => navigate(PAGES.ABOUT)}>About</button>
    </Container>
  )

}