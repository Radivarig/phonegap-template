require('babel-core/polyfill')
import { Actions } from 'flummox'

var server_api = require('../../server/server_api.js')

export default class ActionsApp extends Actions {
  setState(s) { return s }

  async makeRequest(req){
    //fill standard request fields
    req.username = 'test_user'
    
    return await server_api.ajax_post(req)
  }

  async makeRequestWrapper() {
    var req = {
      method: 'request_injection_example'
    }

    return await this.makeRequest(req)
  }

}
