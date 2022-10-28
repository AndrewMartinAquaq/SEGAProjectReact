import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Error from '../error/Error'
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

  const options = [
    { value: 'none', label: 'None' },
    { value: 'name', label: 'Name' },
    { value: 'semester', label: 'Semester' }
  ]

  const siteCode = 'student'
  const [studentUrl, setStudentUrl] = useState(`http://localhost:8080/api/${siteCode}`)

  const [mainData, setMainData] = useState([])
  const [editingRow, setEditingRow] = useState()
  const [studentMessage, setStudentMessage] = useState('')
  const [studentError, setStudentError] = useState('')

  const [hideFilter, setHideFilter] = useState(true)

  const [state, setState] = useState({
    selectedOption: 'none'
  })

  const [searchData, setSearchData] = useState('')

  useEffect(() => {
    if (state.selectedOption === 'none') {
      setStudentUrl(`http://localhost:8080/api/${siteCode}`)
      setHideFilter(true)
    } else if (state.selectedOption === 'name') {
      setStudentUrl(`http://localhost:8080/api/${siteCode}/name?name=${searchData}`)
      setHideFilter(false)
    } else if (state.selectedOption === 'semester') {
      setStudentUrl(`http://localhost:8080/api/${siteCode}/semester?semester=${searchData}`)
      setHideFilter(false)
    }
  }, [state, searchData])

  useEffect(() => {
    fetch(studentUrl)
      .then((response) => {
        if (response.ok) {
          setStudentError('')
          return response.json()
        }
        response.json().then((error) => setStudentError(error.message))
        return []
      })
      .then((data) => {
        console.log('data received: ', data)
        setMainData(data)
      })
  }, [studentUrl])

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
            response.json().then((data) => { setStudentError(data.message) })
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

  const handleFormChange = (event) => {
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
            const newId = parseInt(data.Link.substring(data.Link.indexOf('t/') + 2, data.Link.length), 10)
            const student = {
              id: newId, firstName: inputs.firstName, lastName: inputs.lastName, graduationDate: inputs.graduationDate
            }
            setMainData(() => [...mainData, student])
          })
        } else {
          response.json().then((data) => setStudentError(data.message))
        }
      })
  }

  const handleSelectChange = ({ target }) => {
    setState({
      selectedOption: target.value
    })
  }

  return (
    <div>
      <label>
        {' Filter Type: '}
      </label>
      <select
        value={state.selectedOption}
        onChange={handleSelectChange}
      >
        {options.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
      </select>
      <label hidden={hideFilter}>
        {` Filter by ${state.selectedOption}: `}
      </label>
      <input type="text" value={searchData} onChange={(e) => setSearchData(e.target.value)} hidden={hideFilter} />
      <br />
      <Error error={studentError} setError={setStudentError} />
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
                  onChange={handleFormChange}
                />
              </td>
              <td className="table-body">
                <input
                  size="10"
                  type="text"
                  name="lastName"
                  value={inputs.lastName || ''}
                  onChange={handleFormChange}
                />
              </td>
              <td className="table-body">
                <input
                  size="10"
                  type="text"
                  name="graduationDate"
                  value={inputs.graduationDate || ''}
                  onChange={handleFormChange}
                />
              </td>
              <td className="table-body">
                <button type="submit">Submit</button>
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
