import 'react-hot-loader/patch'
import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import { AppContainer } from 'react-hot-loader'

require('./redux/initGlobalReduxStore.jsx')()

const renderRoutes = () => {
  const routes = require('./routes.jsx')
  const container = <AppContainer>{routes}</AppContainer>
  ReactDOM.render(container, document.getElementById('app'))
}
renderRoutes()

if (module.hot)
  module.hot.accept('./routes.jsx', renderRoutes)
