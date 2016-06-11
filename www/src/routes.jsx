var React = require('react')

import { Router, Route, Link, browserHistory } from 'react-router'

import FluxComponent from 'flummox/component'
import { FluxAppSingleton } from './flux/FluxApp'

import type { appStateType } from 'types'

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
  getInitialState(): appStateType {
      return {
        stateNumVar: 3,
        stateStrVar: "ok",
      }
  },
  componentDidMount: function () {
    if ( !this.props.request )
      this.handleChange.bind(this, 'request')('{\n  "foo": "bla",\n  "a": "c"\n}')
  }
, handleChange: function(name, e) {
    var chg = {}
    chg[name] = e.target ? e.target.value : e
    this.props.flux.getActions('app').setState(chg)
  }
, sendMessage: function() {
    var self = this
    var req = JSON.parse(this.props.request)
    this.props.flux.getActions('app').makeRequest(req)
      .then(function(res) {
        self.props.flux.getActions('app').setState({
          response: res
        })
        console.log(res)
      })
  }
, render: function() {
    return (
      <div>
        <textarea cols={25} rows={5} type='text' value={this.props.request} onChange={this.handleChange.bind(this, 'request')}/>
        <button onClick={this.sendMessage}>send</button>
        <textarea cols={25} rows={5} type='text' value={JSON.stringify(this.props.response)} disabled={true}/>
      </div>
    )
  }
})

var routes = (
 <Router history={browserHistory}>
    <Route path="/" component={App}>
    </Route>
  </Router>
)

module.exports = routes
