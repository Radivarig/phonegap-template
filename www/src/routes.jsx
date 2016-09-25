import React from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'
import App from 'App'

const routes = (
 <Router history={browserHistory}>
    <Route path="/" component={App}>
    </Route>
  </Router>
)

module.exports = routes
