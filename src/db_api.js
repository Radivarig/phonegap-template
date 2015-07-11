module.exports.ajax_post = function(req, res) {
  var rb = JSON.parse(JSON.stringify(req.body))
  var resSend = function(x) { res.send(x) }
  
  console.log('request body: ', rb)
  resSend({request_body: rb})

}
