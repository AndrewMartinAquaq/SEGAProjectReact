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
    const rowToUpdate = mainData.filter((row) => (row.id === rowData.id))[0]
    console.log('field: ', field)
    console.log('rowToUpdate: ', rowToUpdate)
    const valuePrev = rowData[field]
    const student = rowData
    student[field] = value
    if (rowToUpdate[field] !== valuePrev) {
      fetch(`${studentUrl}/${rowData.id}`, { method: 'PUT', body: JSON.stringify(student), headers: { 'Content-Type': 'application/json' } })
        .then((response) => {
          if (response.ok) {
            rowToUpdate[field] = value
          } else {
            rowToUpdate[field] = `${valuePrev} `
            response.json().then((data) => { console.log('put error', data) })
            console.log('pre value', valuePrev)
          }
        })
    }
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

  const handelEditRow = (dataId) => {
    if (dataId === editingRow) {
      setEditingRow()
    } else {
      setEditingRow(dataId)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('form data', inputs)
    fetch(studentUrl, { method: 'POST', body: JSON.stringify(inputs), headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            console.log('data received: ', data)
            const newId = parseInt(data.Link.charAt(data.Link.length - 1), 10)
            const student = {
              id: newId, firstName: inputs.firstName, lastName: inputs.lastName, graduationDate: inputs.graduationDate
            }
            setMainData(() => [...mainData, student])
          })
        }
      })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
            {mainData.map((data) => (
              <tr key={data.id}>
                {Object.entries(data).map(([prop, value]) => (
                  <td
                    key={`${data.id}/${prop}`}
                    className="table-body"
                    name={prop}
                    contentEditable={(data.id === editingRow) && (prop !== 'id')}
                // eslint-disable-next-line react/no-unknown-property
                    field={prop}
                    onBlur={(event) => {
                      updateRow(event.target.innerHTML, data, prop)
                    }}
                  >
                    {value}
                  </td>
                ))}
                <td className="table-body" key={`${data.id}/edit`}>
                  <button type="button" onClick={() => { handelEditRow(data.id) }}>
                    Edit Row
                  </button>
                </td>
                <td className="table-body" key={`${data.id}/delete`}>
                  <button type="button" onClick={() => { removeRow(data) }}>
                    Delete Row
                  </button>
                </td>
                <td className="table-body" key={`${data.id}/link`}>
                  <Link to={`/students/${data.id}`}>
                    <button type="button">go to student</button>
                  </Link>
                </td>
              </tr>
            ))}
            <tr>
              <td className="table-body">
                #
              </td>
              <td className="table-body">
                <input
                  size="10"
                  type="text"
                  name="firstName"
                  value={inputs.firstName || ''}
                  onChange={handleChange}
                />
              </td>
              <td className="table-body">
                <input
                  size="10"
                  type="text"
                  name="lastName"
                  value={inputs.lastName || ''}
                  onChange={handleChange}
                />
              </td>
              <td className="table-body">
                <input
                  size="10"
                  type="text"
                  name="graduationDate"
                  value={inputs.graduationDate || ''}
                  onChange={handleChange}
                />
              </td>
              <td className="table-body">
                <input type="submit" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <br />
      <h4>{studentMessage}</h4>
      <br />
    </div>
  )
}

export default StudentTable
