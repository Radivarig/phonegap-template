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

export const requestResponse = (state = initialState, action) => {
  const assign = (obj) => {
    const s: requestResponseStateType = Object.assign({}, state, obj)
    return s
  }

  switch (action.type)
  {
    case 'change_request':
      return assign({request: action.request})

    case 'submit_request':
      if (action.status == 'success') {
        return assign({
          isFetching: false,
          isError: false,
          response: action.response,
        })
      }
      else if (action.status == 'error') {
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
