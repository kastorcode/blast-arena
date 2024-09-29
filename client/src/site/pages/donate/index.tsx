import useIsPortrait from '~/hooks/useIsPortrait'
import { copyToClipboard } from '~/services/clipboard'
import { PayPal, Pix } from './assets'
import { Container, PayContainer } from './style'

export default function DonatePage () {

  const isPortrait = useIsPortrait()

  return (
    <Container>
      <h1>DONATE ANY AMOUNT TO THE DEVELOPER</h1>
      <PayContainer isPortrait={isPortrait}>
        <div>
          <div>
            <Pix/>
            <h1>Brazilian Pix</h1>
          </div>
          <img src={`${process.env.PUBLIC_URL}/images/pay/pix.png`} />
          <p>Pix Key</p>
          <button onClick={() => copyToClipboard('kastorcode@gmail.com')}>kastorcode@gmail.com</button>
        </div>
        <div>
          <div>
            <PayPal/>
            <h1>PayPal</h1>
          </div>
          <img src={`${process.env.PUBLIC_URL}/images/pay/paypal.png`} />
          <p>Open PayPal</p>
          <button onClick={() => window.open('https://paypal.com/donate/?hosted_button_id=7Y7XDSJR54HUN', '_blank')}>Open PayPal</button>
        </div>
      </PayContainer>
    </Container>
  )

}