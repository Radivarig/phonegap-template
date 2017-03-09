import React from 'react'
import { connect } from 'react-redux'
import { getRequestResponseDispatches } from 'reducers/requestResponse'

const App = ({
  request, response, isFetching, isError,
  changeRequest, submitRequest,
}) => {
  const buttonText = isFetching ? 'Please wait..' : 'Send'

  const responseOrError = isError ?
    'Error happened. Please try again.' : response

  const onChangeRequest = (e) => changeRequest(e.target.value)

  return (
    <div>

      <textarea
        cols={25} rows={5}
        value={request}
        onChange={onChangeRequest}
      />

      <button
        disabled={isFetching}
        onClick={submitRequest}
      >
        {buttonText}
      </button>

      <textarea
        cols={25} rows={5}
        value={responseOrError}
        disabled
      />

    </div>
  )
}

const mapStateToProps = (state) => {
  const s = state.requestResponse
  return {
    request: s.request,
    response: s.response,
    isFetching: s.isFetching,
    isError: s.isError,
  }
}
const mapDispatchToProps = (dispatch) =>
  getRequestResponseDispatches(dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
) (App)
