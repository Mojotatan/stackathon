import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter, Route} from 'react-router-dom'
import store from './redux/store'

// const socket = io(window.location.origin)

import Avatar from './containers/avatar'

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/" component={Avatar} />
    </BrowserRouter>
  </Provider>,
  document.getElementById('main')
)