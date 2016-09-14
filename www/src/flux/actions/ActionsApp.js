import { Actions } from 'flummox'

const server_api = require('../../server/server_api.js')

export default class ActionsApp extends Actions {
  
  setState(s) { return s }

  async makeRequest(req) {
    return await server_api.ajax_post(req)
  }

}
