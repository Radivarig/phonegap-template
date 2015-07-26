require('babel/polyfill')

module.exports.ajax_post = function(req, res) {
  var rb = JSON.parse(JSON.stringify(req.body))
  var resSend = function(x) { res.send(x) }
  
  console.log('request body: ', rb)
  resSend({request_body: rb})

  async function async_fn1(){
    return
  }
  async function async_fn2(){
    return await async_fn1
  }
}
