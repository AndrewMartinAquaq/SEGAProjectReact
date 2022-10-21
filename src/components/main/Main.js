import React from 'react'
import Header from '../header/header'
import StudentTable from '../table/StudentTable'
import './main.scss'

function Main() {
  return (
    <div>
      <Header header="Students Table -" />
      <StudentTable />
    </div>
  )
}

export default Main
