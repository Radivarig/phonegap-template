export const ajax_post = async function (req, res) {
  const rb = JSON.parse(JSON.stringify(req.body))

  // eslint-disable-next-line no-console
  console.log('request body: ', rb)

  res.send({request_body: rb})

  async function async_fn1 () {

  }
  async function async_fn2 () {
    return await async_fn1
  }
}

