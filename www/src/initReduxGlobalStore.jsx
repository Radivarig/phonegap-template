import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import type { storeStateType } from 'types'
import { ajax_post } from './server/server_api.js'

const initReduxGlobalStore = () => {
  const initialState: storeStateType = {
    request: '{\n  "foo": "bla",\n  "a": "c"\n}',
    response: '',
    isFetching: false,
    isError: false,
  }

  // has to return whole state with different reference
  const reducer = (state, action) => {
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

      case '@@redux/INIT':
        return initialState

      default:
        console.error('Action not matched:', action)
    }
  }

  // Global store
  window.ReduxStore = createStore(
    reducer,
    applyMiddleware(thunk.withExtraArgument({
      ajax_post,
    }))
  )
}

module.exports = initReduxGlobalStore
