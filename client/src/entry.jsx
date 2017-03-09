import React from 'react'
import ReactDOM from 'react-dom'

import { AppContainer } from "react-hot-loader"

const renderRoutes = () => {
  const routes = require('routes').default
  const container = <AppContainer>{routes}</AppContainer>
  ReactDOM.render(container, document.getElementById('app'))
}
renderRoutes()

if (module.hot)
  module.hot.accept('routes', renderRoutes)
