import React from 'react'
import { Router, Route, hashHistory } from 'react-router'
import App from 'App'

module.exports = (
 <Router history={hashHistory}>
    <Route path='/' component={App}>
    </Route>
  </Router>
)
