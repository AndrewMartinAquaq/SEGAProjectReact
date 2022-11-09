import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../header/header'
import Error from '../error/Error'

function EnrollTable() {
  const studentHeaderCols = [
    'Select Student',
    '',
    'Id',
    'First Name',
    'Last Name',
    'Gradutation Year'
  ]

  const courseHeaderCols = [
    'Select Course',
    '',
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

  const [searchParams, setSearchParams] = useSearchParams()

  const courseState = { courseId: searchParams.get('courseId') }
  const studentState = { studentId: searchParams.get('studentId') }

  const setStudentState = (param) => { setSearchParams({ studentId: param.studentId, courseId: courseState.courseId }) }
  const setCourseState = (param) => { setSearchParams({ studentId: studentState.studentId, courseId: param.courseId }) }

  // const [studentState, setStudentState] = useState({
  //   studentId: 0
  // })

  // const [courseState, setCourseState] = useState({
  //   courseId: 0
  // })

  // useEffect(() => {
  //   fetch(studentUrl)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setStudentData(data)
  //       if (data.length === 0) {
  //         setStudentEntry({})
  //         setStudentState({
  //           studentId: 0
  //         })
  //       } else if (studentState.studentId === 'null' || studentState.studentId === null) {
  //         setStudentEntry(data[0])
  //         setStudentState({
  //           studentId: data[0].id
  //         })
  //       } else {
  //         const student = () => data.filter((row) => (row.id === parseInt(studentState.studentId, 10)))
  //         if (student.length === 0) {
  //           setStudentEntry(data[0])
  //           setStudentState({
  //             studentId: data[0].id
  //           })
  //         } else {
  //           setStudentEntry(student[0])
  //         }
  //       }
  //     })
  // }, [studentUrl])

  // useEffect(() => {
  //   fetch(courseUrl)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setCourseData(data)
  //       if (data.length === 0) {
  //         setCourseEntry({})
  //         setCourseState({
  //           courseId: 0
  //         })
  //       } else {
  //         setCourseEntry(data[0])
  //         setCourseState({
  //           courseId: data[0].id
  //         })
  //       }
  //     })
  // }, [courseUrl])

  const renderStudent = () => (
    fetch(studentUrl)
      .then((response) => response.json())
      .then((data) => {
        setStudentData(data)
        if (data.length === 0) {
          setStudentEntry({})
          return ({
            studentId: 0
          })
        }

        if (studentState.studentId === 'null' || studentState.studentId === null) {
          setStudentEntry(data[0])
          return ({
            studentId: data[0].id
          })
        }

        const student = data.filter((row) => (row.id === parseInt(studentState.studentId, 10)))
        if (student.length === 0) {
          setStudentEntry(data[0])
          return ({
            studentId: data[0].id
          })
        }

        setStudentEntry(student[0])
        return ({ studentId: student[0].id })
      })
  )

  const renderCourse = (student) => (
    fetch(courseUrl)
      .then((response) => response.json())
      .then((data) => {
        setCourseData(data)
        if (data.length === 0) {
          setCourseEntry({})
          return ({
            courseId: 0
          })
        }

        if (courseState.courseId === 'null' || courseState.courseId === null) {
          setCourseEntry(data[0])
          return ({
            courseId: data[0].id
          })
        }

        const course = data.filter((row) => (row.id === parseInt(courseState.courseId, 10)))
        if (course.length === 0) {
          setCourseEntry(data[0])
          return ({
            courseId: data[0].id
          })
        }

        setCourseEntry(course[0])
        return ({ courseId: course[0].id })
      })
      .then((course) => ({ studentId: student.studentId, courseId: course.courseId }))
  )

  const initalRender = () => {
    renderStudent()
      .then((student) => renderCourse(student)
        .then((param) => setSearchParams(param)))
  }

  useEffect(() => {
    initalRender()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleStudentChange = ({ target }) => {
    setStudentState({
      studentId: target.value
    })
    setStudentEntry(studentData.filter((row) => (row.id === parseInt(target.value, 10)))[0])
    setEnrollError('')
    setEnrollSuccess('')
  }

  const handleCourseChange = ({ target }) => {
    setCourseState({
      courseId: target.value
    })
    setCourseEntry(courseData.filter((row) => (row.id === parseInt(target.value, 10)))[0])
    setEnrollError('')
    setEnrollSuccess('')
  }

  const enrollUrl = `${url}enroll`

  const handelEnrollSubmit = () => {
    const enroll = { studentId: studentState.studentId, courseId: courseState.courseId }
    fetch(enrollUrl, { method: 'POST', body: JSON.stringify(enroll), headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        if (!response.ok) {
          response.json().then((data) => {
            setEnrollError(data.message)
            setEnrollSuccess('')
          })
        } else {
          setEnrollSuccess('Student succesfully enrolled')
          setEnrollError('')
        }
      })
  }

  const checkSpacer = (col) => {
    if (col === '') {
      return 'table-head-spacer'
    }
    return 'table-head'
  }

  return (
    <div>
      <Header header="Enroll Table - " />
      <Error error={enrollError} setError={setEnrollError} />
      <table>
        <thead>
          <tr>
            {studentHeaderCols.map((col) => (
              <td className={checkSpacer(col)} key={col}>
                {col}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr key={studentEntry}>
            <td className="table-body">
              <select
                className="dropdown"
                value={studentState.studentId}
                onChange={handleStudentChange}
              >
                {studentData.map((data) => (
                  <option value={data.id} key={data.id}>
                    {data.firstName}
                    {' '}
                    {data.lastName}
                  </option>
                ))}
              </select>
            </td>
            <td />
            {Object.entries(studentEntry).map(([prop, value]) => (
              <td
                key={prop}
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
      <br />
      <table>
        <thead>
          <tr>
            {courseHeaderCols.map((col) => (
              <td className={checkSpacer(col)} key={col}>
                {col}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr key={courseEntry}>
            <td className="table-body">
              <select
                className="dropdown"
                value={courseState.courseId}
                onChange={handleCourseChange}
              >
                {courseData.map((data) => (
                  <option value={data.id} key={data.id}>
                    {data.courseName}
                  </option>
                ))}
              </select>
            </td>
            <td />
            {Object.entries(courseEntry).map(([prop, value]) => (
              <td
                key={prop}
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
      <br />
      <button type="button" style={{ width: 'auto' }} onClick={handelEnrollSubmit}> Enroll Student</button>
      <br />
      <h5 className="success">{enrollSuccess}</h5>
    </div>
  )
}

export default EnrollTable
