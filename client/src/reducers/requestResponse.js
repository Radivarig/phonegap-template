export type RequestResponse = {
  request: string,
  response: string,
  isFetching: boolean,
  isError: boolean,
}

export const actions = {
  changeRequest (request: string) {
    return {
      type: 'CHANGE_REQUEST',
      request,
    }
  },

  submitRequest (dispatch: Function) {
    return async function (action, getState, extra) {
      const {ajax_post} = extra
      const req: string = getState().requestResponse.request

      dispatch({type: 'SUBMIT_REQUEST'})

      await ajax_post(JSON.parse(req))
        .then((res) =>
          dispatch({
            type: 'SUBMIT_REQUEST', status: 'SUCCESS',
            response: JSON.stringify(res),
          })
        )
        .catch((err) => {
          // console.log (err)
          dispatch({
            type: 'SUBMIT_REQUEST', status: 'ERROR',
          })
        })
    }
  },
}

export const mapDispatchToProps = (dispatch) =>
  ({
    changeRequest: (...args) => dispatch(actions.changeRequest.apply(null, args)),
    submitRequest: () => dispatch(actions.submitRequest(dispatch)),
  })

const initialState: RequestResponse = {
  request: '{\n"foo": "bla",\n"a": "c"\n}',
  response: '',
  isError: false,
  isFetching: false,
}

export default (state = initialState, action): RequestResponse => {

  switch (action.type) {
    case 'CHANGE_REQUEST':
      return Object.assign ({}, state, {
        request: action.request,
      })

    case 'SUBMIT_REQUEST':
      if (action.status === 'SUCCESS') {
        return Object.assign ({}, state, {
          isFetching: false,
          isError: false,
          response: action.response,
        })
      }
      else if (action.status === 'ERROR') {
        return Object.assign ({}, state, {
          isFetching: false,
          isError: true,
        })
      }
      return Object.assign ({}, state, {
        isFetching: true,
      })

    default:
      return state
  }
}
