import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Student from './pages/student/Student'
import Layout from './pages/layout/Layout'
import Home from './pages/home/Home'
import NoPage from './pages/nopage/NoPage'
import StudentRecord from './pages/studentRecord/StudentRecord'
import Course from './pages/course/Course'
import Enroll from './pages/enroll/Enroll'
import './App.scss'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="students" element={<Student />} />
          <Route path="students/:studentId" element={<StudentRecord />} />
          <Route path="courses" element={<Course />} />
          <Route path="enroll" element={<Enroll />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
