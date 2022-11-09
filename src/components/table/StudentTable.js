import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Error from '../error/Error'
import Warn from '../warn/Warn'
import './Table.scss'

function StudentTable() {
  const headerCols = [
    'Id',
    'First Name',
    'Last Name',
    'Gradutation Year',
    'Edit',
    'Delete',
    'Enroll',
    'Go to'
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

  const [rowToDelete, setRowToDelete] = useState({ id: 0 })
  const [deleteMessage, setDeleteMessage] = useState('Are you sure you want to delete this student?')

  const [hideFilter, setHideFilter] = useState(true)

  const [hideForm, setHideForm] = useState(true)
  const [formButton, setFromButton] = useState('Add New Student')

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
    setSearchData('')
  }, [state])

  useEffect(() => {
    fetch(studentUrl)
      .then((response) => {
        if (response.ok) {
          setStudentError('')
          return response.json()
        }
        response.json().then((error) => {
          if (searchData === '') {
            setStudentError('')
          } else {
            setStudentError(error.message)
          }
        })
        return []
      })
      .then((data) => {
        setMainData(data)
      })
  }, [studentUrl, searchData])

  useEffect(() => {
    if (mainData.length === 0) {
      setStudentMessage('No students recorded - use the form to add one')
    } else {
      setStudentMessage('')
    }
  }, [mainData, studentMessage])

  const updateRow = (value, rowData, field) => {
    const rowToUpdate = mainData.filter((row) => (row.id === rowData.id))[0]
    const valuePrev = rowData[field]
    const student = rowData
    student[field] = value
    if (rowToUpdate[field] !== valuePrev) {
      const editUrl = `http://localhost:8080/api/${siteCode}/${rowData.id}`
      fetch(editUrl, { method: 'PUT', body: JSON.stringify(student), headers: { 'Content-Type': 'application/json' } })
        .then((response) => {
          if (response.ok) {
            rowToUpdate[field] = value
          } else {
            rowToUpdate[field] = `${valuePrev} `
            response.json().then((data) => { setStudentError(data.message) })
          }
        })
    }
  }

  const removeRow = ((rowData) => {
    const deleteUrl = `http://localhost:8080/api/${siteCode}/${rowData.id}`
    fetch(deleteUrl, { method: 'DELETE' })
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

  const handelEditBorder = (dataId, prop) => {
    if (dataId === editingRow && prop !== 'id') {
      return 'table-body-edit'
    }
    return 'table-body'
  }

  const handelHideForm = () => {
    if (hideForm) {
      setHideForm(false)
      setFromButton('Cancel')
    } else {
      setHideForm(true)
      setFromButton('Add New Student')
      setInputs({})
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    fetch(studentUrl, { method: 'POST', body: JSON.stringify(inputs), headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            const newId = parseInt(data.Link.substring(data.Link.indexOf('t/') + 2, data.Link.length), 10)
            const student = {
              id: newId, firstName: inputs.firstName, lastName: inputs.lastName, graduationDate: inputs.graduationDate
            }
            setMainData(() => [...mainData, student])
            handelHideForm()
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
      <div>
        <Error error={studentError} setError={setStudentError} />
        <Warn message={deleteMessage} onWarn={() => removeRow(rowToDelete)} toUpdate={rowToDelete} setToUpdate={setRowToDelete} />
      </div>
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
                    className={handelEditBorder(data.id, prop)}
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
                  <button
                    type="button"
                    onClick={() => {
                      setRowToDelete(data)
                      setStudentError('')
                      setDeleteMessage(`Are you sure you want to delete student at Id ${data.id}?`)
                    }}
                  >
                    Delete Row
                  </button>
                </td>
                <td className="table-body" key={`${data.id}/enroll`}>
                  <Link to={`/enroll?studentId=${data.id}`}>
                    <button type="button">Enroll</button>
                  </Link>
                </td>
                <td className="table-body" key={`${data.id}/link`}>
                  <Link to={`/students/${data.id}`}>
                    <button type="button">Go to student</button>
                  </Link>
                </td>
              </tr>
            ))}
            <tr hidden={hideForm}>
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
      <button type="button" onClick={() => handelHideForm()} style={{ width: 'fit-content' }}>{formButton}</button>
      <br />
      <h4>{studentMessage}</h4>
      <br />
    </div>
  )
}

export default StudentTable
