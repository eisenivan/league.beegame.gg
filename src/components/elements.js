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

export function Input ({ ...props }) {
  return (
    <input
      className='shadow inline-block appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
      placeholder={props.placeholder || ''}
      name={props.name || ''}
      value={props.value || ''}
      onChange={props.onChange}
      required={props.required || false} />
  )
}

export function Button ({ children, ...props }) {
  return (
    <button
      className='float bg-gray-1 hover:bg-blue-700 text-gray-3 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
      type={props.type || 'button'}
      onClick={props.onClick}>
      {children}
    </button>
  )
}

export function Select ({ children, ...props }) {
  return (
    <select
      className='shadow inline-block appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
      placeholder={props.placeholder}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      required={props.required || false}
    >
      {children}
    </select>
  )
}

export function FormBox ({ children }) {
  return (
    <div className='flex flex-col mb-4'>
      {children}
    </div>
  )
}

export function Error ({ error, className }) {
  let msg
  if (typeof error === 'string') {
    msg = error
  } else {
    msg = Object.keys(error)
      .map(key => `${key !== 'non_field_errors' ? `${key}: ` : ''}${error[key].join(', ')}`)
  }

  console.log(msg)

  return <span className={`${className} text-red-500`}>{msg}</span>
}
