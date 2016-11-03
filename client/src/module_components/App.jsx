import React from 'react'
import { Provider, connect } from 'react-redux'
import getReduxStore from 'getReduxStore'
import { getRequestResponseDispatches } from 'reducers/requestResponse'

const AppView = React.createClass({
  render () {
    const buttonText = this.props.isFetching ?
      'Please wait..'
    : 'Send'

    const response = this.props.isError ?
      'Error happened. Please try again.'
    : this.props.response

    const onChangeRequest = (e) => this.props.changeRequest(e.target.value)
    const onSubmitRequest = this.props.submitRequest

    return (
      <div>

        <textarea
          cols={25} rows={5}
          value={this.props.request}
          onChange={onChangeRequest}
        />

        <button
          disabled={this.props.isFetching}
          onClick={onSubmitRequest}
        >
          {buttonText}
        </button>

        <textarea
          cols={25} rows={5}
          value={response}
          disabled
        />

      </div>
    )
  },
})

const mapStateToProps = (state) => {
  const s = state.requestResponse
  return {
    request: s.get('request'),
    response: s.get('response'),
    isFetching: s.get('isFetching'),
    isError: s.get('isError'),
  }
}
const mapDispatchToProps = (dispatch) =>
   Object.assign(getRequestResponseDispatches(dispatch), {
   })

const ConnectedAppView = connect(
  mapStateToProps,
  mapDispatchToProps
) (AppView)

const App = React.createClass({
  render () {
    return (
      <Provider store={getReduxStore()}>
        <ConnectedAppView/>
      </Provider>
    )
  },
})

module.exports = App
