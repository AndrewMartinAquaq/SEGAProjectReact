import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function StudentCoursesTable() {
  const params = useParams()

  const headerCols = [
    'Id',
    'Course Name',
    'Capacity',
    'Credit',
    'Subject',
    'Semester',
    'Unenroll'
  ]

  const [semesterData, setSemesterData] = useState('')

  const [courseError, setCourseError] = useState('')

  const siteCode = 'student'
  const [courseUrl, setCourseUrl] = useState(`http://localhost:8080/api/${siteCode}/${params.studentId}/course`)

  const [mainData, setMainData] = useState([])

  useEffect(() => {
    fetch(courseUrl)
      .then((response) => {
        const json = response.json()
        if (response.ok) {
          setCourseError('')
          return json
        }
        json.then((data) => {
          console.log('api error', data)
          setCourseError(data.message)
        })
        return []
      })
      .then((data) => {
        console.log('data received: ', data)
        setMainData(data)
      })
  }, [semesterData, courseUrl])

  useEffect(() => {
    if (semesterData === '') {
      setCourseUrl(`http://localhost:8080/api/${siteCode}/${params.studentId}/course`)
    } else {
      setCourseUrl(`http://localhost:8080/api/${siteCode}/${params.studentId}/course?semester=${semesterData}`)
    }
  }, [semesterData, params.studentId])

  const unenrollFromCourse = ((rowData) => {
    console.log('unenroll', rowData)
    console.log('filter', mainData.filter((row) => (row.id !== rowData.id)))
    const unenroll = { studentId: params.studentId, courseId: rowData.id }
    fetch('http://localhost:8080/api/enroll', { method: 'DELETE', body: JSON.stringify(unenroll), headers: { 'Content-Type': 'application/json' } })
      .then(() => setMainData(mainData.filter((row) => (row.id !== rowData.id))))
  })

  return (
    <div>
      <label>
        Enter Semester:
        <input
          type="text"
          value={semesterData}
          onChange={(e) => setSemesterData(e.target.value)}
        />
      </label>
      <h6 className="error">{courseError}</h6>

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
                  // eslint-disable-next-line react/no-unknown-property
                  field={prop}
                >
                  {value}
                </td>
              ))}
              <td className="table-body" key={`${data.id}/delete`}>
                <button type="button" onClick={() => { unenrollFromCourse(data) }}>
                  Unenroll
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentCoursesTable
