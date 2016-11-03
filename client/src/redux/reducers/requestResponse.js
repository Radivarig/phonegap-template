export type requestResponseStateType = {
  request: string;
  response: string;
  isFetching: boolean;
  isError: boolean;
}

const initialState: requestResponseStateType = {
  request: '{\n  "foo": "bla",\n  "a": "c"\n}',
  response: '',
  isFetching: false,
  isError: false,
}

export const actions = {
  changeRequest(request: string) {
    return {
      type: 'CHANGE_REQUEST',
      request,
    }
  },

  submitRequest(dispatch: Function) {
    return async function(action, getState, extra) {
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
          console.log (err)
          dispatch({
            type: 'SUBMIT_REQUEST', status: 'ERROR',
          })
        })
    }
  },
}

export const getRequestResponseDispatches = (dispatch) => {
  return {
    changeRequest: (...args) => dispatch(actions.changeRequest.apply(null, args)),
    submitRequest: () => dispatch(actions.submitRequest(dispatch)),
  }
}

export const requestResponse = (state = initialState, action) => {
  const assign = (obj): requestResponseStateType => Object.assign({}, state, obj)

  switch (action.type)
  {
    case 'CHANGE_REQUEST':
      return assign({request: action.request})

    case 'SUBMIT_REQUEST':
      if (action.status == 'SUCCESS') {
        return assign({
          isFetching: false,
          isError: false,
          response: action.response,
        })
      }
      else if (action.status == 'ERROR') {
        return assign({
          isFetching: false,
          isError: true,
        })
      }
      return assign({isFetching: true})

    default:
      return state
  }
}
