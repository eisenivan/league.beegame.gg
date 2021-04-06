import React from 'react'
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
    cookie.save('token', token, { path: '/', secure: !process.env.NODE_ENV === 'development' })
    setUserCookies()

    // navigate browser to the current page with no query string
    history.push({
      search: ''
    })
  }

  return (
    <div id='app' className='bg-triangle_bg_dark text-gray-1 min-h-screen'>
      { process.env.REACT_APP_STAGE === 'true'
        ? <div className='bg-red-800 text-white text-center'>This is not production data</div>
        : null}
      <Header />
      <main className='container p-2 m-auto lg:p-8'>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Chrome
