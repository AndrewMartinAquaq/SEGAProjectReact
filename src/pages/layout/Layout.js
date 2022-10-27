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

    const regex = /^\/students\/\d*$/g
    if (regex.test(location.pathname) && link === '/students') {
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
        </ul>
      </nav>

      <Outlet />
    </>
  )
}

export default Layout
