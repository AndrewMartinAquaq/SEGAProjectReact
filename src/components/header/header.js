import React from 'react'
import { string } from 'prop-types'

export default function Header(props) {
  const { header } = props
  return (
    <h1 className="brand-page-title">
      {header}
    </h1>
  )
}

Header.propTypes = {
  header: string
}
Header.defaultProps = {
  header: ''
}
