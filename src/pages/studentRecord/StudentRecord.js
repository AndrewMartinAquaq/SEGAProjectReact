import React from 'react'
import StudentRecordTable from '../../components/table/StudentRecordsTable'
import StudentCoursesTable from '../../components/table/StudentCoursesTable'

function Student() {
  return (
    <div>
      <StudentRecordTable />
      <StudentCoursesTable />
    </div>
  )
}

export default Student
