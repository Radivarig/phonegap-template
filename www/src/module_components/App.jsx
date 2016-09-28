import React from 'react'
import { Provider, connect } from 'react-redux'

const AppView = React.createClass({
  render() {
    const buttonText = this.props.isFetching ?
      'Please wait..'
    : 'Send'

    const response = this.props.isError ?
      'Error happened. Please try again.'
    : this.props.response

    return (
      <div>

        <textarea
          cols={25} rows={5}
          value={this.props.request}
          onChange={this.props.onChangeRequest}
        />

        <button
          disabled={this.props.isFetching}
          onClick={this.props.onClickSubmit}
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
  }
})

const mapStateToProps = (state) => {
  return {
    request: state.request,
    response: state.response,
    isFetching: state.isFetching,
    isError: state.isError,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeRequest: (e) => dispatch({
      type: 'change_request',
      request: e.target.value,
    }),

    onClickSubmit: () => {
      dispatch(async (action, getState, extra) => {
        const {ajax_post} = extra
        const req: string = getState().request

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
      })
    },

  }
}

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
