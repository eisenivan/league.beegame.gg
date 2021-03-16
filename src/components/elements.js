import React from 'react'
import styled from 'styled-components'

export const linkString = 'hover:text-yellow-2 transition-colors'

export function Link ({ children, ...props }) {
  return (
    <a className={linkString} {...props}>{children}</a>
  )
}

export const AvatarContainer = styled.div`
  background-image: ${props => props.imgUrl ? `url(${props.imgUrl})` : 'none'};
  background-size: cover;
  background-position: center;
`

export function PageTitle ({ children }) {
  return <h1 className='text-2xl mb-4 font-head uppercase inline-block'>{children}</h1>
}

export function PageSubtitle ({ children }) {
  return <div className='text-xs -mt-4'>{children}</div>
}

export function H2 ({ children }) {
  return <h2 className='text-2xl my-2 font-subhead inline-block'>{children}</h2>
}

export function H3 ({ children }) {
  return <h3 className='text-xl my-2 font-subhead inline-block'>{children}</h3>
}

export function LightContentBox ({ children }) {
  return <div className='bg-triangle_bg_light p-2 lg:p-8'>{children}</div>
}
