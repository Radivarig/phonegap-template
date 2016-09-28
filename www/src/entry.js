import 'babel-polyfill'
import React from'react'
import ReactDOM from'react-dom'

import initGlobalReduxStore from './initGlobalReduxStore.jsx'
initGlobalReduxStore()

import routes from'./routes.jsx'

ReactDOM.render(routes, document.getElementById('app'))

