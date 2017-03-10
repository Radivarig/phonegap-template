import React from 'react'
import { shallow } from 'enzyme'
import App from 'components/App'

const _App = shallow (<App request='' response='' isError={false} isFetching={false} />)
const requestTextarea = _App.find('textarea.__request_textarea__')
const responseTextarea = _App.find('textarea.__response_textarea__')
const submitButton = _App.find('button.__submit_button__')

it ('should contain a single non disabled textarea for request', () => {
  expect (requestTextarea.length).toEqual (1)
  expect (requestTextarea.html().includes ('disabled=""')).toEqual (false)
})

it ('should contain a single disabled textarea for response', () => {
  expect (responseTextarea.length).toEqual (1)
  expect (responseTextarea.html().includes ('disabled=""')).toEqual (true)
})

it ('should contain a single non disabled submit button', () => {
  expect (submitButton.length).toEqual (1)
  expect (submitButton.html().includes ('disabled=""')).toEqual (false)
})
