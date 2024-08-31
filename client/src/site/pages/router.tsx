import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import AboutPage from '~/site/pages/about'
import DonatePage from '~/site/pages/donate'
import HomePage from '~/site/pages/home'

export default createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<HomePage/>}>
    <Route path='donate' element={<DonatePage/>} />
    <Route path='about' element={<AboutPage/>} />
  </Route>
))