import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Error from '../error/Error'
import Warn from '../warn/Warn'
import './Table.scss'

function CourseTable() {
  const headerCols = [
    'Id',
    'Course Name',
    'Capacity',
    'Credit',
    'Subject',
    'Semester',
    'Edit',
    'Delete',
    'Enroll',
    'Go to'
  ]

  const options = [
    { value: 'none', label: 'None' },
    { value: 'name', label: 'Name' },
    { value: 'subject', label: 'Subject' }
  ]

  const siteCode = 'course'
  const [courseUrl, setCourseUrl] = useState(`http://localhost:8080/api/${siteCode}`)
  const [searchData, setSearchData] = useState('')

  const [mainData, setMainData] = useState([])
  const [editingRow, setEditingRow] = useState()
  const [courseMessage, setCourseMessage] = useState('')
  const [courseError, setCourseError] = useState('')
  const [hideFilter, setHideFilter] = useState(true)

  const [rowToDelete, setRowToDelete] = useState({ id: 0 })
  const [deleteMessage, setDeleteMessage] = useState('Are you sure you want to delete this course?')

  const [hideForm, setHideForm] = useState(true)
  const [formButton, setFromButton] = useState('Add New Course')

  const [state, setState] = useState({
    selectedOption: 'none'
  })

  useEffect(() => {
    if (state.selectedOption === 'none') {
      setCourseUrl(`http://localhost:8080/api/${siteCode}`)
      setHideFilter(true)
    } else if (state.selectedOption === 'subject') {
      if (searchData === '') {
        setCourseUrl(`http://localhost:8080/api/${siteCode}`)
      } else {
        setCourseUrl(`http://localhost:8080/api/${siteCode}?subject=${searchData}`)
      }
      setHideFilter(false)
    } else if (state.selectedOption === 'name') {
      if (searchData === '') {
        setCourseUrl(`http://localhost:8080/api/${siteCode}`)
      } else {
        setCourseUrl(`http://localhost:8080/api/${siteCode}/name?name=${searchData}`)
      }
      setHideFilter(false)
    }
  }, [searchData, state])

  useEffect(() => {
    setSearchData('')
  }, [state])

  useEffect(() => {
    fetch(courseUrl)
      .then((response) => {
        if (response.ok) {
          setCourseError('')
          return response.json()
        }
        response.json().then((error) => {
          if (searchData === '') {
            setCourseError('')
          } else {
            setCourseError(error.message)
          }
        })
        return []
      })
      .then((data) => {
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
    const valuePrev = rowData[field]
    const course = rowData
    course[field] = value
    Object.entries(course).forEach(([key, val]) => {
      if (key !== 'id') {
        course[key] = String(val).trim()
      }
    })
    const editUrl = `http://localhost:8080/api/${siteCode}/${rowData.id}`
    if (rowToUpdate[field] !== valuePrev) {
      fetch(editUrl, { method: 'PUT', body: JSON.stringify(course), headers: { 'Content-Type': 'application/json' } })
        .then((response) => {
          if (response.ok) {
            rowToUpdate[field] = value
          } else {
            rowToUpdate[field] = `${valuePrev} `
            response.json().then((data) => { setCourseError(data.message) })
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

  const handelEditBorder = (dataId, prop) => {
    if (dataId === editingRow && prop !== 'id') {
      return 'table-body-edit'
    }
    return 'table-body'
  }

  const handleSelectChange = ({ target }) => {
    setState({
      selectedOption: target.value
    })
  }

  const handelHideForm = () => {
    if (hideForm) {
      setHideForm(false)
      setFromButton('Cancel')
    } else {
      setHideForm(true)
      setFromButton('Add New Course')
      setInputs({})
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    fetch(courseUrl, { method: 'POST', body: JSON.stringify(inputs), headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            const newId = parseInt(data.Link.substring(data.Link.indexOf('e/') + 2, data.Link.length), 10)
            const course = {
              id: newId,
              courseName: inputs.courseName,
              capacity: inputs.capacity,
              credit: inputs.credit,
              subject: inputs.subject,
              semester: inputs.semester
            }
            setMainData(() => [...mainData, course])
            handelHideForm()
          })
        } else {
          response.json().then((data) => setCourseError(data.message))
        }
      })
  }

  return (
    <div>
      <Error error={courseError} setError={setCourseError} />
      <Warn message={deleteMessage} onWarn={() => removeRow(rowToDelete)} toUpdate={rowToDelete} setToUpdate={setRowToDelete} />
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
      <input
        hidden={hideFilter}
        type="text"
        value={searchData}
        onChange={(e) => setSearchData(e.target.value)}
      />
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
                    suppressContentEditableWarning="true"
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
                      setCourseError('')
                      setDeleteMessage(`Are you sure you want to delete course at Id ${data.id}?`)
                    }}
                  >
                    Delete Row
                  </button>
                </td>
                <td className="table-body" key={`${data.id}/enroll`}>
                  <Link to={`/enroll?courseId=${data.id}`}>
                    <button type="button">Enroll</button>
                  </Link>
                </td>
                <td className="table-body" key={`${data.id}/link`}>
                  <Link to={`/courses/${data.id}`}>
                    <button type="button">Go to course</button>
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
                <button type="submit">Submit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <br />
      <button type="button" onClick={() => handelHideForm()} style={{ width: 'fit-content' }}>{formButton}</button>
      <br />
      <h4>{courseMessage}</h4>
      <br />
    </div>
  )
}

export default CourseTable
