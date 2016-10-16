import type { requestResponseStateType } from 'types'

const requestResponse = (state, action) => {

  const initialState: requestResponseStateType = {
    request: '{\n  "foo": "bla",\n  "a": "c"\n}',
    response: '',
    isFetching: false,
    isError: false,
  }
  if (state === undefined)
    return initialState

  // has to return whole state with different reference
  const assign = (obj) => {
    const s: storeStateType = Object.assign({}, state, obj)
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
      console.error('Action not matched:', action)
      return state
  }
}
module.exports = requestResponse
