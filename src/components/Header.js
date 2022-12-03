import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { linkString } from './elements'
import { NavLink, Link, useHistory } from 'react-router-dom'
import cookie from 'react-cookies'
import getApiUrl from '../modules/get-api-url'
import nukeTokens from '../modules/nuke-tokens'

const navStyle = 'bg-transparent p-1 lg:py-2 lg:px-3 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75'

const HeaderLogo = styled.img`
  margin: -0.5rem -1rem -1.6rem -1.7rem;
  min-width: 7rem;
  min-height: 7rem;
`

function NavItem ({ children, to, exact = false }) {
  return (
    <NavLink activeClassName='text-yellow-2' exact={exact} className={navStyle} to={to}>
      {children}
    </NavLink>
  )
}

function Header () {
  const [token, setToken] = useState(null)
  const history = useHistory()

  async function logout () {
    nukeTokens()
    setToken(null)
    history.go(0)
  }

  useEffect(() => {
    setToken(cookie.load('token'))
  }, [token])

  return (
    <header className='justify-between pt-2 pb-4 border-b border-gray-700 md:p-2 md:border-none md:flex lg:px-8'>
      <div className='flex items-center justify-center md:justify-start'>
        <Link to='/' className={`${linkString} text-gray-1 font-head uppercase text-2xl flex flex-wrap items-center`}><HeaderLogo className='h-28' alt='Beegame.gg emblem logo' src='/img/logo_BGL_emblem.png' /> League.Beegame.gg</Link>
      </div>
      <nav className='flex flex-wrap items-center justify-center md:justify-start'>
        {/* <NavItem to='/register' className={`${linkString} text-gray-1`}>Register</NavItem> */}
        <NavItem to='/circuits' className={`${linkString} text-gray-1`}>Circuits</NavItem>
        {/* <NavItem to='/teams' className={`${linkString} text-gray-1`}>Teams</NavItem> */}
        <NavItem to='/casters' className={`${linkString} text-gray-1`}>Casters</NavItem>
        <NavItem to='/help' className={`${linkString} text-gray-1`}>Help</NavItem>
        <NavItem to='/links' className={`${linkString} text-gray-1`}>Links</NavItem>

        { token
          ? (
            <>
              <NavItem className={`${linkString} text-gray-1`} to='/profile'>Profile</NavItem>
              <button className={`${linkString} ${navStyle} hidden md:inline`} onClick={logout}>Logout</button>
              <button className='absolute top-0 right-0 px-1 mt-2 mr-2 text-gray-500 underline rounded-sm md:hidden text-2xs' onClick={logout}>Logout</button>
            </>
          )
          : <a className={`${linkString} ${navStyle}`} href={`${getApiUrl()}accounts/discord/login/`}>Login</a> }

      </nav>
    </header>
  )
}

export default Header
