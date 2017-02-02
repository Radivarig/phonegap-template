const {loginHandler} = require ('./loginHandler.js')
const {dbHandler} = require ('./dbHandler.js')

//do migration up
//require('../db/migrations/20170131022311_development.js').up(require('../db/knex.js'))

export const ajaxHandler = {
  handlePostRequest: async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('request body: ', req.body)

    const {
      email,
      method,
      token,
      session,
    } = req.body

    const packResponse = (returnObject: Object = {}) => {
      Object.assign(returnObject, {
        method,
      })
      // eslint-disable-next-line no-console
      console.log('response body: ', returnObject)

      res.send (returnObject)
    }

    // if email is invalid return error

    // decline request if not registered and not requesting first login
    const isRegistered = await loginHandler.getIsUserRegistered(email)
    if (! isRegistered) {
      if (['request_login_token', 'confirm_login_token'].indexOf(method) === -1)
        return packResponse ({error: {message: 'not_registered'}})
    }

    // login methods

    if (method === 'request_login_token')
      return packResponse(await ajaxHandler.requestLoginToken(email))

    if (method === 'confirm_login_token') {
      if (typeof(token) !== 'string')
        return packResponse ({error: {message: 'string_token_required'}})

      return packResponse(await ajaxHandler.confirmLoginToken(email, token))
    }

    if (! await loginHandler.getSessionValidity(email, session))
      return packResponse({error: {message: 'invalid_session'}})

    // call this last if nothing else returns
    return packResponse({error: {message: 'invalid_method'}})
  },

  confirmLoginToken: async (email: string, token: string): Promise<Object> =>
    await loginHandler.confirmLoginToken(email, token),

  requestLoginToken: async (email: string): Promise => {
    const token = await loginHandler.handleRequestLoginToken(email)

    // TODO send email confirmation link

    const isInsertedUnconfirmed = await dbHandler.getColumn('id', 'unconfirmed', {email})
    const isInsertedUsers = await dbHandler.getColumn('id', 'users', {email})

  },

}
