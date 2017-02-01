const {loginHandler} = require ('./loginHandler.js')

export const ajaxHandler = {
  handlePostRequest: async (req, res) => {
    // eslint-disable-next-line
    console.log('request body: ', req.body)

    const packResponse = (returnObject: Object = {}) => {
      Object.assign(returnObject, {
      })
      // eslint-disable-next-line
      console.log('response body: ', returnObject)

      res.send (returnObject)
    }

    const {
      email,
    } = req.body

    if (loginHandler.handleIfUnregisteredUser(email)) return packResponse ()
  },

}
