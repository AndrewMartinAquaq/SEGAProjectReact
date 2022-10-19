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
                Student
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
