import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { ajax_post } from '../server/server_api.js'

import reducer from './reducers/reducer'

module.exports = () => {

  // Global store
  window.ReduxStore = createStore(
    reducer,
    applyMiddleware(thunk.withExtraArgument({
      ajax_post,
    }))
  )
}
