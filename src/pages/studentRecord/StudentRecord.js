import React, { useState } from 'react'
import StudentRecordTable from '../../components/table/StudentRecordsTable'
import StudentCoursesTable from '../../components/table/StudentCoursesTable'
import Error from '../../components/error/Error'

function Student() {
  const [error, setError] = useState('')

  return (
    <div>
      <Error error={error} setError={setError} />
      <StudentRecordTable setStudentError={setError} />
      <StudentCoursesTable setCourseError={setError} />
    </div>
  )
}

export default Student
