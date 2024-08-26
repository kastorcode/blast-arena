import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import HomePage from '~/site/pages/home'

export default createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<HomePage/>}></Route>
))