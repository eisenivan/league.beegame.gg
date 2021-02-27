import React from 'react'
import Header from './Header'
import Footer from './Footer'

function Chrome ({ children }) {
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
