const ajax_URL = require('./ajax_URL')

const request = (method, url, data) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.onload = (x) => resolve(JSON.parse(x.target.response))
    xhr.onerror = reject
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
  })

const server_api = {
  ajax_post (data) {
    return request('POST', ajax_URL + '/ajax_post', data)
  },
}

module.exports = server_api
