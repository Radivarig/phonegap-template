import React from 'react'
import { Provider, connect } from 'react-redux'
// TODO use async actions
import { ajax_post } from '../server/server_api.js'

const AppView = React.createClass({
  render() {
    const onClickSubmit =() => this.props.onClickSubmit(this.props.request)
    const response = this.props.isError ? 'Error' : this.props.response
    return (
      <div>

        <textarea
          cols={25} rows={5} type='text'
          value={this.props.request}
          onChange={this.props.onChangeRequest}
        />

        <button onClick={onClickSubmit}>send</button>

        <textarea disabled
          cols={25} rows={5} type='text'
          value={response}
        />

      </div>
    )
  }
})

function mapStateToProps(state) {
  return {
    request: state.request,
    response: state.response,
    isFetching: state.isFetching,
    isError: state.isError,
  }
}

function mapDispatchToProps(dispatch) {
  return {

    onChangeRequest: (e) => dispatch({
      type: 'change_request',
      request: e.target.value,
    }),

    onClickSubmit: async (req: string) => {
      dispatch({type: 'submit_request'})
      await ajax_post(JSON.parse(req))
        .then((res) =>
          dispatch({
            type: 'submit_request', status: 'success',
            response: JSON.stringify(res),
          })
        )
        .catch((err) => {
          console.log (err)
          dispatch({
            type: 'submit_request', status: 'error',
          })
        })
    },

  }
}

// Connected Component
const ConnectedAppView = connect(
  mapStateToProps,
  mapDispatchToProps
) (AppView)

const App = React.createClass({
  render() {
    return (
      <Provider store={window.ReduxStore}>
        <ConnectedAppView/>
      </Provider>
    )
  }
})

module.exports = App
