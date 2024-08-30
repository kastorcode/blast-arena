import useIsPortrait from '~/hooks/useIsPortrait'
import { Computer, Gamepad, Smartphone } from './assets'
import { AuthorContainer, Container, Footer, GameContainer } from './style'

interface SectionProps {
  isPortrait : boolean
}

function AuthorSection ({isPortrait}:SectionProps) {
  return (
    <AuthorContainer isPortrait={isPortrait}>
      <div>
        <h1>Author</h1>
        <img src='https://avatars.githubusercontent.com/u/34523460' />
      </div>
      <div>
        <h1>Matheus Ramalho de Oliveira</h1>
        <p>Super Software Engineer</p>
        <div>
          <div>
            <button onClick={() => window.open('https://github.com/kastorcode', '_blank')}>GitHub</button>
            <button onClick={() => window.open('https://br.linkedin.com/in/kastorcode', '_blank')}>LinkedIn</button>
          </div>
          <div>
            <button onClick={() => window.open('https://instagram.com/kastorcode', '_blank')}>Instagram</button>
            <button onClick={() => window.open('https://play.google.com/store/apps/dev?id=5473691445787144856', '_blank')}>Google Play</button>
          </div>
        </div>
      </div>
    </AuthorContainer>
  )
}

function GameSection () {
  return (
    <GameContainer>
      <h1>Blast Arena</h1>
      <p>Blast Arena is a browser based, battle royale and online multiplayer game. With old school 2D graphics and a nostalgic soundtrack, 4 players compete for victory using bombs on a board. Invite your friends to epic battles and use power ups to enhance your skills, who will have the best strategy?</p>
      <div>
        <Gamepad />
        <Smartphone />
        <Computer />
      </div>
    </GameContainer>
  )
}

export default function AboutPage () {

  const isPortrait = useIsPortrait()

  return (
    <Container>
      <AuthorSection isPortrait={isPortrait} />
      <GameSection />
      <Footer>
        <a href='https://github.com/kastorcode' target='_blank' title='Powered by KastorCode'>&lt;kastor.code/&gt;</a>
      </Footer>
    </Container>
  )

}