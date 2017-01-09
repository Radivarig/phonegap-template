import React from 'react'
import { Router, Route, hashHistory } from 'react-router'
import App from 'App'

const ExampleRoute = ({params}) =>
  <div>Example route with param: {params.param}.</div>

const NotFoundRoute = () => <div>Route not found.</div>

module.exports = (
  <Router history={hashHistory}>
    <Route path='/' component={App} />
    <Route path='/example/:param' component={ExampleRoute} />
    <Route path='*' component={NotFoundRoute} />
  </Router>
)
