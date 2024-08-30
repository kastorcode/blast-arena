import { useNavigate } from 'react-router-dom'
import { Container } from './style'

export default function Menu () {

  const navigate = useNavigate()

  return (
    <Container>
      <button onClick={() => navigate('/')}>Home</button>
      <button onClick={() => navigate('/about')}>About</button>
    </Container>
  )

}