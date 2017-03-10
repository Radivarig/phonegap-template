import React from 'react'

export default ({
  request, response, isFetching, isError,
  changeRequest, submitRequest,
}) => {
  const buttonText = isFetching ? 'Please wait..' : 'Send'

  const responseOrError = isError ?
    'Error happened. Please try again.' : response

  const onChangeRequest = (e) => changeRequest(e.target.value)

  return (
    <div>

      <textarea
        className='__request_textarea__'
        cols={25} rows={5}
        value={request}
        onChange={onChangeRequest}
      />

      <button
        className='__submit_button__'
        disabled={isFetching}
        onClick={submitRequest}
      >
        {buttonText}
      </button>

      <textarea
        className='__response_textarea__'
        cols={25} rows={5}
        value={responseOrError}
        disabled
      />

    </div>
  )
}
