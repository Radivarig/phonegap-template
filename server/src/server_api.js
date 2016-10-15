const ajax_post = async function(req, res) {
  let rb = JSON.parse(JSON.stringify(req.body))
  console.log('request body: ', rb)
  res.send({request_body: rb})

  async function async_fn1() {
    return
  }
  async function async_fn2() {
    return await async_fn1
  }
}

module.exports = {
  ajax_post
}
