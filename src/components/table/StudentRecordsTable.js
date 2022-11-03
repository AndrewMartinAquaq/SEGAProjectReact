/* eslint-disable no-console */
import { func } from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../header/header'

function StudentRecordTable(props) {
  const params = useParams()

  const {
    setStudentError, setDeleteMessage, setDeleteRow, setRowToDelete
  } = props

  const navigate = useNavigate()

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
    const rowToUpdate = mainData
    console.log('field: ', field)
    console.log('rowToUpdate: ', rowToUpdate)
    const valuePrev = rowData[field]
    const student = rowData
    student[field] = value
    if (rowToUpdate[field] !== valuePrev) {
      fetch(studentUrl, { method: 'PUT', body: JSON.stringify(student), headers: { 'Content-Type': 'application/json' } })
        .then((response) => {
          if (response.ok) {
            rowToUpdate[field] = value
          } else {
            rowToUpdate[field] = `${valuePrev} `
            response.json().then((data) => { setStudentError(data.message) })
            console.log('pre value', valuePrev)
          }
        })
    }
  }

  const handelEditRow = (dataId) => {
    if (dataId === editingRow) {
      setEditingRow()
    } else {
      setEditingRow(dataId)
    }
  }

  const removeRow = (() => fetch(studentUrl, { method: 'DELETE' }).then(() => navigate('/students'))
  )

  const onRemoveRow = (() => {
    setDeleteMessage(`Are you sure you want to delete student at Id ${mainData.id}?`)
    setRowToDelete({ id: mainData.id })
    setDeleteRow(() => removeRow)
  })

  useEffect(() => {
    if (mainData.id == null) {
      fetch(studentUrl)
        .then((response) => {
          if (!response.ok) {
            navigate('/students')
          }
          return response.json()
        })
        .then((data) => {
          console.log('data received: ', data)
          setMainData(data)
        })
    }
  }, [mainData, studentUrl, editingRow, navigate])

  return (
    <div>
      <Header header="Student Records Table - " />
      <table>
        <thead>
          <tr>
            {headerCols.map((col) => (
              <td className="table-head" key={col}>
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
                contentEditable={mainData.id === editingRow && prop !== 'id'}
                // eslint-disable-next-line react/no-unknown-property
                field={prop}
                onBlur={(event) => {
                  updateRow(event.target.innerHTML, mainData, prop)
                }}
                key={`${mainData.id}/${prop}`}
              >
                {value}
              </td>
            ))}
            <td className="table-body">
              <button type="button" onClick={() => { handelEditRow(mainData.id) }}>
                Edit Row
              </button>
            </td>
            <td className="table-body">
              <button type="button" onClick={() => { onRemoveRow() }}>
                Delete Row
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
    </div>
  )
}

export default StudentRecordTable

StudentRecordTable.propTypes = {
  setStudentError: func,
  setDeleteMessage: func,
  setDeleteRow: func,
  setRowToDelete: func
}

StudentRecordTable.defaultProps = {
  setStudentError: () => {},
  setDeleteMessage: () => {},
  setDeleteRow: () => {},
  setRowToDelete: () => {}
}
