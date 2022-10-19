import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function StudentRecordTable() {
  const params = useParams()

  const headerCols = [
    'Id',
    'First Name',
    'Last Name',
    'Gradutation Year',
    'Edit',
    'Delete'
  ]

  const siteCode = 'student'
  const studentUrl = `http://localhost:8080/api/${siteCode}/${params.studentId}`

  const [mainData, setMainData] = useState({})

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
    fetch(`${studentUrl}/${rowData.id}`, { method: 'DELETE' })
      .then(() => setMainData(mainData.filter((row) => (row.id !== rowData.id))))
  })

  useEffect(() => {
    if (mainData.id == null) {
      fetch(studentUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log('data received: ', data)
          setMainData(data)
        })
    }
  }, [mainData, studentUrl, editingRow])

  return (
    <div>
      <h1>
        StudentRecordTable-
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
            <tr key={mainData.id}>
              {Object.entries(mainData).map(([prop, value]) => (
                <td
                  className="table-body"
                  name={prop}
                  contentEditable={mainData.id === editingRow}
                // eslint-disable-next-line react/no-unknown-property
                  field={prop}
                  onBlur={(event) => {
                    updateRow(event.target.innerHTML, mainData, prop)
                  }}
                >
                  {value}
                </td>
              ))}
              <td className="table-body">
                <button type="button" onClick={() => { setEditingRow(mainData.id) }}>
                  Edit Row
                </button>
              </td>
              <td className="table-body">
                <button type="button" onClick={() => { removeRow(mainData) }}>
                  Delete Row
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </h1>
      <br />
      <br />
    </div>
  )
}

export default StudentRecordTable
