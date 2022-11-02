import {
  func, number, shape, string
} from 'prop-types'
import React, { useEffect, useState } from 'react'
import './warn.scss'

function Warn(props) {
  const {
    message, onWarn, toUpdate, setToUpdate
  } = props

  const [hideWarn, setHideWarn] = useState(true)

  useEffect(() => {
    if (toUpdate.id !== 0) { setHideWarn(false) }
  }, [toUpdate, onWarn])

  const hide = () => {
    setToUpdate({ id: 0 })
    setHideWarn(true)
  }

  const execute = () => {
    onWarn(toUpdate)
    hide()
  }

  return (
    <div>
      <div className="warn" hidden={hideWarn}>
        <h4>{message}</h4>
        <button type="button" className="confirm" style={{ width: 'auto' }} onClick={() => { execute() }}>Confirm</button>
        <button type="button" className="cancel" style={{ width: 'auto' }} onClick={() => { hide() }}>Cancel</button>
      </div>
    </div>
  )
}

export default Warn

Warn.propTypes = {
  message: string,
  onWarn: func,
  toUpdate: shape({ id: number }),
  setToUpdate: func
}

Warn.defaultProps = {
  message: 'Are you sure you want to continue?',
  onWarn: () => {},
  toUpdate: { id: 0 },
  setToUpdate: () => {}
}
