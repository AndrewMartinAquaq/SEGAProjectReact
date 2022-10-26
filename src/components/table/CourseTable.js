import React, { useState, useEffect } from 'react'
import Error from '../error/Error'
import './StudentTable.scss'

function CourseTable() {
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

  // const mainData = []

  const siteCode = 'course'
  const [courseUrl, setCourseUrl] = useState(`http://localhost:8080/api/${siteCode}`)
  const [searchData, setSearchData] = useState('')

  const [mainData, setMainData] = useState([])
  const [editingRow, setEditingRow] = useState()
  const [courseMessage, setCourseMessage] = useState('')
  const [courseError, setCourseError] = useState('')

  useEffect(() => {
    if (searchData === '') {
      setCourseUrl(`http://localhost:8080/api/${siteCode}`)
    } else {
      setCourseUrl(`http://localhost:8080/api/${siteCode}?subject=${searchData}`)
    }
  }, [searchData])

  useEffect(() => {
    fetch(courseUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('data received: ', data)
        setMainData(data)
      })
  }, [courseUrl, searchData])

  useEffect(() => {
    if (mainData.length === 0) {
      setCourseMessage('No courses recorded - use the form to add one')
    } else {
      setCourseMessage('')
    }
  }, [mainData, courseMessage])

  const updateRow = (value, rowData, field) => {
    const rowToUpdate = mainData.filter((row) => (row.id === rowData.id))[0]
    console.log('field: ', field)
    console.log('rowToUpdate: ', rowToUpdate)
    const valuePrev = rowData[field]
    const course = rowData
    course[field] = value
    if (rowToUpdate[field] !== valuePrev) {
      fetch(`${courseUrl}/${rowData.id}`, { method: 'PUT', body: JSON.stringify(course), headers: { 'Content-Type': 'application/json' } })
        .then((response) => {
          if (response.ok) {
            rowToUpdate[field] = value
          } else {
            rowToUpdate[field] = `${valuePrev} `
            response.json().then((data) => { setCourseError(data.message) })
            console.log('pre value', valuePrev)
          }
        })
    }
  }

  const removeRow = ((rowData) => {
    console.log('remove row', rowData)
    console.log('filter', mainData.filter((row) => (row.id !== rowData.id)))
    fetch(`${courseUrl}/${rowData.id}`, { method: 'DELETE' })
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
    fetch(courseUrl, { method: 'POST', body: JSON.stringify(inputs), headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            console.log('data received: ', data)
            const newId = parseInt(data.Link.charAt(data.Link.length - 1), 10)
            const course = {
              id: newId,
              courseName: inputs.courseName,
              capacity: inputs.capacity,
              credit: inputs.credit,
              subject: inputs.subject,
              semester: inputs.semester
            }
            setMainData(() => [...mainData, course])
          })
        } else {
          response.json().then((data) => setCourseError(data.message))
        }
      })
  }

  return (
    <div>
      <Error error={courseError} setError={setCourseError} />
      <label>
        {' Filter by Subject: '}
        <input
          type="text"
          value={searchData}
          onChange={(e) => setSearchData(e.target.value)}
        />
      </label>
      <br />
      <br />
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
                  name="courseName"
                  value={inputs.courseName || ''}
                  onChange={handleChange}
                />
              </td>
              <td className="table-body">
                <input
                  type="number"
                  name="capacity"
                  value={inputs.capacity || ''}
                  onChange={handleChange}
                />
              </td>
              <td className="table-body">
                <input
                  type="number"
                  name="credit"
                  value={inputs.credit || ''}
                  onChange={handleChange}
                />
              </td>
              <td className="table-body">
                <input
                  size="10"
                  type="text"
                  name="subject"
                  value={inputs.subject || ''}
                  onChange={handleChange}
                />
              </td>
              <td className="table-body">
                <input
                  size="10"
                  type="text"
                  name="semester"
                  value={inputs.semester || ''}
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
      <h4>{courseMessage}</h4>
      <br />
    </div>
  )
}

export default CourseTable
