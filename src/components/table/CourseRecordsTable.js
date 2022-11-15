import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Error from '../error/Error'
import Warn from '../warn/Warn'
import Header from '../header/header'

function CourseRecordTable() {
  const params = useParams()

  const navigate = useNavigate()

  const [courseError, setCourseError] = useState()

  const [deleteMessage, setDeleteMessage] = useState()

  const [rowToDelete, setRowToDelete] = useState()

  const headerCols = [
    'Id',
    'Course Name',
    'Capacity',
    'Credit',
    'Subject',
    'Semester',
    'Edit',
    'Delete',
    'Enroll'
  ]

  const siteCode = 'course'
  const courseUrl = `http://localhost:8080/api/${siteCode}/${params.courseId}`

  const [mainData, setMainData] = useState({})

  const [editingRow, setEditingRow] = useState()

  const updateRow = (value, rowData, field) => {
    const rowToUpdate = mainData
    const valuePrev = rowData[field]
    const course = rowData
    course[field] = value
    Object.entries(course).forEach(([key, val]) => {
      if (key !== 'id') {
        course[key] = String(val).trim()
      }
    })
    if (rowToUpdate[field] !== valuePrev) {
      fetch(courseUrl, { method: 'PUT', body: JSON.stringify(course), headers: { 'Content-Type': 'application/json' } })
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

  const removeRow = (() => fetch(courseUrl, { method: 'DELETE' }).then(() => navigate('/courses'))
  )

  const onRemoveRow = (() => {
    setDeleteMessage(`Are you sure you want to delete course at Id ${mainData.id}?`)
    setRowToDelete({ id: mainData.id })
  })

  useEffect(() => {
    if (mainData.id == null) {
      fetch(courseUrl)
        .then((response) => {
          if (!response.ok) {
            navigate('/courses')
          }
          return response.json()
        })
        .then((data) => {
          setMainData(data)
        })
    }
  }, [mainData, courseUrl, editingRow, navigate])

  return (
    <div>
      <Error error={courseError} setError={setCourseError} />
      <Warn message={deleteMessage} onWarn={() => removeRow()} toUpdate={rowToDelete} setToUpdate={setRowToDelete} />
      <Header header="Course Records Table - " />
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
                className={handelEditBorder(mainData.id, prop)}
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
            <td className="table-body" key={`${mainData.id}/enroll`}>
              <Link to={`/enroll?courseId=${mainData.id}`}>
                <button type="button">Enroll</button>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
    </div>
  )
}

export default CourseRecordTable
