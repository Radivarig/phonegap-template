var React = require('react')
var Router = require('react-router')
  , { Route, DefaultRoute, RouteHandler, Navigation } = Router

import FluxComponent from 'flummox/component'
import { FluxAppSingleton } from './flux/FluxApp'

var App = React.createClass({
  render: function(){
    return (
      <FluxComponent flux={FluxAppSingleton} connectToStores={['app']}>
        <AppView {...this.props}/>
      </FluxComponent>
    )
  }
})

var AppView = React.createClass({
  handleChange: function(name, e) {
    var chg = {}
    chg[name] = e.target.value
    this.props.flux.getActions('app').setState(chg)
  }
, sendMessage: function() {
    var input = this.props.input
    var req = {
      input: input
    }

    this.props.flux.getActions('app').makeRequest(req)
      .then(function(res){
        console.log('response', res)
      })
  }
, render: function() {
    return (
      <div>
        <input type='text' value={this.props.input} onChange={this.handleChange.bind(this, 'input')}/>
        <button onClick={this.sendMessage}>send</button>
        <RouteHandler/>
      </div>
    )
  }
})

    //<DefaultRoute name="demo" handler={Demo}/>
var routes = (
  <Route name="app" path="/" handler={App}>
  </Route>
)

module.exports = routes
