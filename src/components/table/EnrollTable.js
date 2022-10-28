/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import Header from '../header/header'
import Error from '../error/Error'

function EnrollTable() {
  const selectFields = ['Select Student', 'Select Course']

  const studentHeaderCols = [
    'Id',
    'First Name',
    'Last Name',
    'Gradutation Year'
  ]

  const courseHeaderCols = [
    'Id',
    'Course Name',
    'Capacity',
    'Credit',
    'Subject',
    'Semester'
  ]

  const courseSiteCode = 'course'
  const studentSiteCode = 'student'
  const url = 'http://localhost:8080/api/'

  const courseUrl = `${url}${courseSiteCode}`
  const studentUrl = `${url}${studentSiteCode}`

  const [courseData, setCourseData] = useState([])
  const [studentData, setStudentData] = useState([])

  const [courseEntry, setCourseEntry] = useState({})
  const [studentEntry, setStudentEntry] = useState({})

  const [enrollError, setEnrollError] = useState('')
  const [enrollSuccess, setEnrollSuccess] = useState('')

  const [studentState, setStudentState] = useState({
    selectedOption: 'None'
  })

  const [courseState, setCourseState] = useState({
    selectedOption: 'None'
  })

  useEffect(() => {
    fetch(studentUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('data received: ', data)
        setStudentData(data)
        if (data.length === 0) {
          setStudentEntry({})
          setStudentState({
            selectedOption: 0
          })
        } else {
          setStudentEntry(data[0])
          setStudentState({
            selectedOption: data[0].id
          })
        }
      })
  }, [studentUrl])

  useEffect(() => {
    fetch(courseUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('data received: ', data)
        setCourseData(data)
        if (data.length === 0) {
          setCourseEntry({})
          setCourseState({
            selectedOption: 0
          })
        } else {
          setCourseEntry(data[0])
          setCourseState({
            selectedOption: data[0].id
          })
        }
      })
  }, [courseUrl])

  const handleStudentChange = ({ target }) => {
    setStudentState({
      selectedOption: target.value
    })
    setStudentEntry(studentData.filter((row) => (row.id === parseInt(target.value, 10)))[0])
    setEnrollError('')
    setEnrollSuccess('')
  }

  const handleCourseChange = ({ target }) => {
    setCourseState({
      selectedOption: target.value
    })
    setCourseEntry(courseData.filter((row) => (row.id === parseInt(target.value, 10)))[0])
    setEnrollError('')
    setEnrollSuccess('')
  }

  const enrollUrl = `${url}enroll`

  const handelEnrollSubmit = () => {
    const enroll = { studentId: studentState.selectedOption, courseId: courseState.selectedOption }
    fetch(enrollUrl, { method: 'POST', body: JSON.stringify(enroll), headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        if (!response.ok) {
          response.json().then((data) => {
            console.log('error', data)
            setEnrollError(data.message)
            setEnrollSuccess('')
          })
        } else {
          setEnrollSuccess('Student succesfully enrolled')
          setEnrollError('')
        }
      })
  }

  return (
    <div>
      <Header header="Enroll Table - " />
      <Error error={enrollError} setError={setEnrollError} />
      <table>
        <thead>
          <tr>
            {selectFields.map((col) => (
              <td className="table-head" key={col}>
                {col}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="table-body">
              <select
                value={studentState.selectedOption}
                onChange={handleStudentChange}
              >
                {studentData.map((data) => (
                  <option value={data.id}>
                    {data.firstName}
                    {' '}
                    {data.lastName}
                  </option>
                ))}
              </select>
            </td>
            <td className="table-body">
              <select
                value={courseState.selectedOption}
                onChange={handleCourseChange}
              >
                {courseData.map((data) => (
                  <option value={data.id}>
                    {data.courseName}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <button type="button" style={{ width: 'auto' }} onClick={handelEnrollSubmit}> Enroll Student</button>
      <br />
      <h5 className="success">{enrollSuccess}</h5>
      <table>
        <thead>
          <tr>
            {studentHeaderCols.map((col) => (
              <td className="table-head">
                {col}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr key={studentEntry}>
            {Object.entries(studentEntry).map(([prop, value]) => (
              <td
                className="table-body"
                name={prop}
                // eslint-disable-next-line react/no-unknown-property
                field={prop}
              >
                {value}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            {courseHeaderCols.map((col) => (
              <td className="table-head">
                {col}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr key={courseEntry}>
            {Object.entries(courseEntry).map(([prop, value]) => (
              <td
                className="table-body"
                name={prop}
                // eslint-disable-next-line react/no-unknown-property
                field={prop}
              >
                {value}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default EnrollTable
