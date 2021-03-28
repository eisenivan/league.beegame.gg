import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { linkString } from './elements'
import { NavLink, Link } from 'react-router-dom'
import cookie from 'react-cookies'

const HeaderLogo = styled.img`
  margin: -0.5rem -1rem -1.6rem -1.7rem;
  min-width: 7rem;
  min-height: 7rem;
`

function NavItem ({ children, to, exact = false }) {
  return (
    <NavLink activeClassName='text-yellow-2' exact={exact} className='bg-transparent px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75' to={to}>
      {children}
    </NavLink>
  )
}

function Header () {
  const [token, setToken] = useState(null)

  async function logout () {
    await cookie.remove('token', { path: '/' })
    setToken(null)
  }

  useEffect(() => {
    setToken(cookie.load('token'))
  }, [token])

  return (
    <header className='md:flex justify-between p-2 lg:px-8'>
      <div className='flex items-center'>
        <Link to='/' className={`${linkString} text-gray-1 font-head uppercase text-2xl flex items-center`}><HeaderLogo className='h-28' alt='Beegame.gg emblem logo' src='/img/logo_BGL_emblem.png' /> League.Beegame.gg</Link>
      </div>
      <nav className='flex items-center'>
        <NavItem to='/register' className={`${linkString} text-gray-1`}>Register a team</NavItem>
        <NavItem to='/circuits' className={`${linkString} text-gray-1`}>Circuits</NavItem>
        <NavItem to='/teams' className={`${linkString} text-gray-1`}>Teams</NavItem>

        { token
          ? (
            <>
              <NavItem className={`${linkString} text-gray-1`} to='/profile'>Profile</NavItem>
              <button className={`${linkString} text-gray-1 bg-transparent px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75`} onClick={logout}>Logout</button>
            </>
          )
          : <a className={`${linkString} text-gray-1 bg-transparent px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75`} href={`${process.env.REACT_APP_API_URL}accounts/discord/login/`}>Login</a> }

      </nav>
    </header>
  )
}

export default Header
