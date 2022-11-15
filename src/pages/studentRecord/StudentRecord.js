import React, { useState } from 'react'
import StudentRecordTable from '../../components/table/StudentRecordsTable'
import StudentCoursesTable from '../../components/table/StudentCoursesTable'
import Error from '../../components/error/Error'
import Warn from '../../components/warn/Warn'

function StudentRecord() {
  const [error, setError] = useState('')

  const [rowToDelete, setRowToDelete] = useState({ id: 0 })

  const [removeRow, setRemoveRow] = useState()

  const [deleteMessage, setDeleteMessage] = useState('')

  return (
    <div>
      <Error error={error} setError={setError} />
      <Warn message={deleteMessage} onWarn={() => removeRow(rowToDelete)} toUpdate={rowToDelete} setToUpdate={setRowToDelete} />
      <StudentRecordTable
        setStudentError={setError}
        setDeleteMessage={setDeleteMessage}
        setDeleteRow={setRemoveRow}
        setRowToDelete={setRowToDelete}
      />
      <StudentCoursesTable
        setCourseError={setError}
        setDeleteMessage={setDeleteMessage}
        setDeleteRow={setRemoveRow}
        setRowToDelete={setRowToDelete}
      />
    </div>
  )
}

export default StudentRecord
