import { Map as EMap} from 'extendable-immutable'
import Immutable, { List } from 'immutable'

export class RequestResponse extends EMap {
  request: string
  response: string
  isFetching: boolean
  isError: boolean

  constructor (request: string = '') {
    super({request, response: '', isFetching: false, isError: false})
  }
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
      const req: string = getState().requestResponse.get('request')

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

export const getRequestResponseDispatches = (dispatch) =>
   ({
     changeRequest: (...args) => dispatch(actions.changeRequest.apply(null, args)),
     submitRequest: () => dispatch(actions.submitRequest(dispatch)),
   })

const initialState: RequestResponse = new RequestResponse('{\n  "foo": "bla",\n  "a": "c"\n}')
export const requestResponse = (state = initialState, action) => {

  switch (action.type) {
    case 'CHANGE_REQUEST':
      return state.set('request', action.request)

    case 'SUBMIT_REQUEST':
      if (action.status === 'SUCCESS') {
        return state
          .set('isFetching', false)
          .set('isError', false)
          .set('response', action.response)
      }
      else if (action.status === 'ERROR') {
        return state
          .set('isFetching', false)
          .set('isError', true)
      }
      return state.set('isFetching', true)

    default:
      return state
  }
}
