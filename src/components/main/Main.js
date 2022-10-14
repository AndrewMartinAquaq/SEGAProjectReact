import React from 'react'
import Header from '../header/header'
import MyTable from '../table/myTable'
import './main.scss'

function Main() {
  return (
    <div>
      <Header myHeader="My Header Value" />
      <MyTable />
    </div>
  )
}

export default Main
