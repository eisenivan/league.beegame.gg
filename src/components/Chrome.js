import React from 'react'
import moment from 'moment'
import { useLocation, useHistory } from 'react-router-dom'
import cookie from 'react-cookies'
import Header from './Header'
import Footer from './Footer'
import setUserCookies from '../modules/set-tokens'

function Chrome ({ children }) {
  const history = useHistory()
  const search = useLocation().search
  const token = new URLSearchParams(search).get('token')

  if (token) {
    const expires = new Date(moment().add(6, 'months').toDate())

    cookie.save('token', token, {
      path: '/',
      secure: !process.env.NODE_ENV === 'development',
      expires
    })

    setUserCookies()

    // navigate browser to the current page with no query string
    history.push({
      search: ''
    })
  }

  return (
    <div id='app' className='flex flex-col min-h-screen bg-triangle_bg_dark text-gray-1'>
      { process.env.REACT_APP_STAGE === 'true'
        ? <div className='text-center text-white bg-red-800'>This is not production data</div>
        : null}
      <Header />
      <main className='container flex-1 p-5 m-auto lg:p-8'>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Chrome
