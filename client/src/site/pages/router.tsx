import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { PAGES } from '~/constants'
import AboutPage from '~/site/pages/about'
import DonatePage from '~/site/pages/donate'
import HomePage from '~/site/pages/home'

export default createBrowserRouter(createRoutesFromElements(
  <Route path={PAGES.HOME} element={<HomePage/>}>
    <Route path={PAGES.DONATE} element={<DonatePage/>} />
    <Route path={PAGES.ABOUT} element={<AboutPage/>} />
  </Route>
))