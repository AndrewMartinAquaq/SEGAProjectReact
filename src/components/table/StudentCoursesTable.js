import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function StudentCoursesTable() {
  const params = useParams()

  const headerCols = [
    'Id',
    'Course Name',
    'Capacity',
    'Credit',
    'Subject',
    'Semester',
    'Edit',
    'Delete'
  ]

  const [semesterData, setSemesterData] = useState('')

  const [courseError, setCourseError] = useState('')

  const siteCode = 'student'
  const courseUrl = `http://localhost:8080/api/${siteCode}/${params.studentId}/course?semester=${semesterData}`

  const [mainData, setMainData] = useState([])

  useEffect(() => {
    fetch(courseUrl)
      .then((response) => {
        const json = response.json()
        if (response.ok) {
          setCourseError('')
          return json
        }
        json.then((data) => {
          console.log('api error', data)
          setCourseError(data.message)
        })

        return []
      })
      .then((data) => {
        console.log('data received: ', data)
        setMainData(data)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semesterData])

  const [editingRow, setEditingRow] = useState()

  const updateRow = (value, rowData, field) => {
    const rowToUpdate = mainData.filter((row) => (row.id === rowData.id))
    console.log('rowToUpdate[0]: ', rowToUpdate[0])
    console.log('field: ', field)
    rowToUpdate[0][field] = value
  }

  const removeRow = ((rowData) => {
    console.log('remove row', rowData)
    console.log('filter', mainData.filter((row) => (row.id !== rowData.id)))
    fetch(`${courseUrl}/${rowData.id}`, { method: 'DELETE' })
      .then(() => setMainData(mainData.filter((row) => (row.id !== rowData.id))))
  })

  return (
    <div>
      <form>
        <label>
          Enter Semester:
          <input
            type="text"
            value={semesterData}
            onChange={(e) => setSemesterData(e.target.value)}
          />
        </label>
        <h6 className="error">{courseError}</h6>
      </form>
      <table>
        <thead>
          <tr>
            {headerCols.map((col) => (
              <td className="table-head">
                {col}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {mainData.map((data) => (
            <tr key={data.id}>
              {Object.entries(data).map(([prop, value]) => (
                <td
                  className="table-body"
                  name={prop}
                  contentEditable={data.id === editingRow}
                  // eslint-disable-next-line react/no-unknown-property
                  field={prop}
                  onBlur={(event) => {
                    updateRow(event.target.innerHTML, data, prop)
                  }}
                >
                  {value}
                </td>
              ))}
              <td className="table-body">
                <button type="button" onClick={() => { setEditingRow(data.id) }}>
                  Edit Row
                </button>
              </td>
              <td className="table-body">
                <button type="button" onClick={() => { removeRow(data) }}>
                  Delete Row
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentCoursesTable
