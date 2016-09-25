import 'babel-polyfill'
import React from'react'
import ReactDOM from'react-dom'

import initReduxGlobalStore from './initReduxGlobalStore.jsx'
initReduxGlobalStore()

import routes from'./routes.jsx'

ReactDOM.render(routes, document.getElementById('app'))

