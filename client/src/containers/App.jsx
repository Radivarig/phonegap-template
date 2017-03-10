import React from 'react'
import { connect } from 'react-redux'
import { getRequestResponseDispatches } from 'reducers/requestResponse'

import App from 'components/App'

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
