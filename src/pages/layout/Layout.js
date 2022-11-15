import { Outlet, Link, useLocation } from 'react-router-dom'
import React from 'react'
import './Layout.scss'

function Layout() {
  const location = useLocation()

  const links = [
    { name: 'Home', link: '/' },
    { name: 'Students', link: '/students' },
    { name: 'Courses', link: '/courses' },
    { name: 'Enroll', link: '/enroll' }
  ]

  const checkLink = (link) => {
    if (link === location.pathname) {
      return 'selected'
    }

    const studentRegex = /^\/students\/\d*$/g
    if (studentRegex.test(location.pathname) && link === '/students') {
      return 'selected'
    }

    const courseRegex = /^\/courses\/\d*$/g
    if (courseRegex.test(location.pathname) && link === '/courses') {
      return 'selected'
    }

    return 'linkitem'
  }

  return (
    <>
      <nav className="topNav">
        <ul>
          {links.map((data) => (
            <li key={data.name}>
              <Link className="linkitem" to={data.link}>
                <div className={checkLink(data.link)}>
                  {data.name}
                </div>
              </Link>
            </li>
          ))}
          <li className="title">
            <img className="logo" src="nav-logo.png" alt="logo on the nav bar" />
            <div className="text">Student Enrollment</div>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
}

export default Layout
