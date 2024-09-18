import 'react-toastify/dist/ReactToastify.min.css'
import '~/prototype/array'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import router from '~/site/pages/router'
import store from '~/store'

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <ToastContainer/>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
)