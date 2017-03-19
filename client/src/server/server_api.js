import ajax_URL from './ajax_URL'
import request from 'superagent'

export const ajax_post = (data) =>
  request
  .post(`${ajax_URL}/ajax_post`)
  .send(data)

/*
const request = (method, url, data) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.onload = (x) => resolve(JSON.parse(x.target.response))
    xhr.onerror = reject
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
  })
*/
