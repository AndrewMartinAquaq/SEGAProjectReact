import React from 'react'
import Header from '../header/header'
import StudentTable from '../table/StudentTable'
import './main.scss'

function Main() {
  return (
    <div>
      <Header myHeader="My Header Value" />
      <StudentTable />
    </div>
  )
}

export default Main
