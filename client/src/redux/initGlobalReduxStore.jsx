import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import type { storeStateType } from 'types'
import { ajax_post } from './server/server_api.js'

import reducer from './redux/reducers/reducer'

module.exports = () => {

  // Global store
  window.ReduxStore = createStore(
    reducer,
    applyMiddleware(thunk.withExtraArgument({
      ajax_post,
    }))
  )
}
