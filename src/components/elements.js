import React from 'react'

export const linkString = 'hover:text-yellow-2 transition-colors'

export function Link ({ children, ...props }) {
  return (
    <a className={linkString} {...props}>{children}</a>
  )
}

export function PageTitle ({ children }) {
  return <h1 className='text-2xl mb-4 font-head uppercase'>{children}</h1>
}

export function H2 ({ children }) {
  return <h2 className='text-2xl mb-4 font-subhead'>{children}</h2>
}
