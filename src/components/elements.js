import React from 'react'

export const linkString = 'hover:text-yellow-2 transition-colors'

export function Link ({ children, ...props }) {
  return (
    <a className={linkString} {...props}>{children}</a>
  )
}
