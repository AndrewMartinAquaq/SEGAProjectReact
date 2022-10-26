import React, { useState, useEffect } from 'react'
import { func, string } from 'prop-types'
import './error.scss'

function Error(props) {
  const { error, setError } = props

  const [hideError, setHideError] = useState(true)

  useEffect(() => {
    if (error === '') {
      setHideError(true)
    } else {
      setHideError(false)
    }
  }, [error])

  return (
    <div className="error" hidden={hideError}>
      <h4>{error}</h4>
      <button type="button" onClick={() => { setError('') }}>Dismiss</button>
    </div>
  )
}

export default Error

Error.propTypes = {
  error: string,
  setError: func
}

Error.defaultProps = {
  error: '',
  setError: () => {}
}
