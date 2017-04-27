import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter, Route} from 'react-router-dom'
import store from './redux/store'

const socket = io(window.location.origin)

import Canvas from './components/canvas'

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/" component={Canvas} />
    </BrowserRouter>
  </Provider>,
  document.getElementById('main')
)