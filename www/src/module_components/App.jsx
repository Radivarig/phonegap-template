import React from 'react'
import type { appStateType } from 'types'

import FluxComponent from 'flummox/component'
import { FluxAppSingleton } from '../flux/FluxApp'

const App = React.createClass({
  render(){
    return (
      <FluxComponent flux={FluxAppSingleton} connectToStores={['app']}>
        <AppView {...this.props}/>
      </FluxComponent>
    )
  }
})

const AppView = React.createClass({
  getInitialState(): appStateType {
      return {
        stateNumVar: 3,
        stateStrVar: "ok",
      }
  },
  componentDidMount () {
    if ( !this.props.request )
      this.handleChange.bind(this, 'request')('{\n  "foo": "bla",\n  "a": "c"\n}')
  }
, handleChange(name, e) {
    let chg = {}
    chg[name] = e.target ? e.target.value : e
    this.props.flux.getActions('app').setState(chg)
  }
, sendMessage() {
    const req = JSON.parse(this.props.request)
    this.props.flux.getActions('app').makeRequest(req)
      .then((res) => {
        this.props.flux.getActions('app').setState({
          response: res
        })
        console.log(res)
      })
  }
, render() {
    return (
      <div>
        <textarea cols={25} rows={5} type='text' value={this.props.request} onChange={this.handleChange.bind(this, 'request')}/>
        <button onClick={this.sendMessage}>send</button>
        <textarea cols={25} rows={5} type='text' value={JSON.stringify(this.props.response)} disabled={true}/>
      </div>
    )
  }
})

module.exports = App
