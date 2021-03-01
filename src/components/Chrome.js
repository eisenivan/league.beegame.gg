import React from 'react'
import { useLocation } from 'react-router-dom'
import cookie from 'react-cookies'
import Header from './Header'
import Footer from './Footer'

function Chrome ({ children }) {
  const search = useLocation().search
  const token = new URLSearchParams(search).get('token')

  if (token) {
    cookie.save('token', token, { path: '/', secure: !process.env.NODE_ENV === 'development' })
  }

  return (
    <div id='app'>
      <Header />
      <main className='container p-2 m-auto lg:p-8'>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Chrome
