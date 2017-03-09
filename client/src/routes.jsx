import React from 'react'

import thunk from 'redux-thunk'
import { ajax_post } from 'server/server_api'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'

import { Router, Route, hashHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import reducers from 'reducers'

import App from 'containers/App'
const ParamsExample = ({params}) => <div>Route with param: {params.someParam}</div>
// eslint-disable-next-line no-shadow
const NotFoundRoute = ({location}) => <div>Route not found: {location.pathname}</div>

import { composeWithDevTools } from 'redux-devtools-extension'

const store = createStore (
  combineReducers ({
    ...reducers,
    routing: routerReducer,
  }),
  composeWithDevTools (
    applyMiddleware (
      thunk.withExtraArgument ({ajax_post}),
  )),
)

// eslint-disable-next-line no-shadow
const history = syncHistoryWithStore (hashHistory, store)

export default
  <Provider store={store}>
    <Router history={history}>

      <Route path='/' component={App} />
      <Route path='/paramsExample/:someParam' component={ParamsExample} />
      <Route path='*' component={NotFoundRoute} />

    </Router>
  </Provider>
