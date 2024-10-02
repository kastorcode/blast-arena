import styled from 'styled-components'
import { isInternetSlow } from '~/site/util/net'

export const Container = styled.div`
  background-image: ${() => isInternetSlow() ? 'none' : `url(${process.env.PUBLIC_URL}/images/bg/0.jpg)`};
  background-position: bottom;
  background-size: cover;
  height: 100%;
  overflow: auto;
  width: 100%;
`