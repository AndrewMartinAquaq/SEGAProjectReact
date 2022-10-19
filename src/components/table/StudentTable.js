import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './StudentTable.scss'

function StudentTable() {
  const headerCols = [
    'Id',
    'First Name',
    'Last Name',
    'Gradutation Year',
    'Edit',
    'Delete'
  ]

  // const mainData = []

  const siteCode = 'student'
  const studentUrl = `http://localhost:8080/api/${siteCode}`

  const [mainData, setMainData] = useState([])
  const [editingRow, setEditingRow] = useState()
  const [studentMessage, setStudentMessage] = useState('')

  useEffect(() => {
    if (mainData.length === 0) {
      fetch(studentUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log('data received: ', data)
          setMainData(data)
        })
    }
  })

  useEffect(() => {
    if (mainData.length === 0) {
      setStudentMessage('No students recorded - use the form to add one')
    } else {
      setStudentMessage('')
    }
  }, [mainData, studentMessage])

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

  const [inputs, setInputs] = useState({})

  const handleChange = (event) => {
    const { name } = event.target
    const { value } = event.target
    setInputs((values) => ({ ...values, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('form data', inputs)
    const newId = mainData[mainData.length - 1].id + 1
    const student = {
      id: newId, firstName: inputs.firstName, lastName: inputs.lastName, graduationDate: inputs.graduationDate
    }
    fetch(studentUrl, { method: 'POST', body: JSON.stringify(student), headers: { 'Content-Type': 'application/json' } })
      .then((response) => response.json())
      .then((data) => {
        console.log('data received: ', data)
      })
      .then(() => setMainData(() => [...mainData, student]))
    console.log('list', mainData)
  }

  return (
    <div>
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
              <td className="table-body">
                <Link to={`/students/${data.id}`}>
                  go to student
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <h4>{studentMessage}</h4>
      <br />
      <form onSubmit={handleSubmit}>
        <label>
          Enter First Name:
          <input
            type="text"
            name="firstName"
            value={inputs.firstName || ''}
            onChange={handleChange}
          />
        </label>
        <br />
        <br />
        <label>
          Enter Last Name:
          <input
            type="text"
            name="lastName"
            value={inputs.lastName || ''}
            onChange={handleChange}
          />
        </label>
        <br />
        <br />
        <label>
          Enter Gradutation Date:
          <input
            type="text"
            name="graduationDate"
            value={inputs.graduationDate || ''}
            onChange={handleChange}
          />
        </label>
        <br />
        <br />
        <input type="submit" />
        <br />
        <br />
      </form>
    </div>
  )
}

export default StudentTable
