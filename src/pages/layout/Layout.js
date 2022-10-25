import { Outlet, Link } from 'react-router-dom'
import React from 'react'
import './Layout.scss'

function Layout() {
  return (
    <>
      <nav className="topNav">
        <ul>
          <li>
            <Link className="linkitem" to="/">
              <div className="linkitem">
                Home
              </div>
            </Link>
          </li>
          <li>
            <Link className="linkitem" to="/students">
              <div className="linkitem">
                Students
              </div>
            </Link>
          </li>
          <li>
            <Link className="linkitem" to="/courses">
              <div className="linkitem">
                Courses
              </div>
            </Link>
          </li>
          <li>
            <Link className="linkitem" to="/enroll">
              <div className="linkitem">
                Enroll
              </div>
            </Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
}

export default Layout
