import React from 'react'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'

export const utilityButtonString = 'uppercase bg-blue-3 hover:bg-blue-900 text-white py-1 px-2 text-center font-head text-xs'
export const linkString = 'hover:text-yellow-2 transition-colors'

export function MatchBox ({ match, children }) {
  return (
    <div key={`${match.home.name}${match.away.name}${match.id}`} className='shadow-xl mb-4 max-w-lg'>
      <div className='uppercase font-head text-2xl'>
        <div className='text-gray-1 bg-blue-2 p-4 truncate text-shadow flex justify-between'>
          <RouterLink className='text-white truncate' to={`/teams/${match.away.id}/`}>{match.away.name}</RouterLink>
          { match.result
            ? <span className='ml-2 text-3xl'>{match.result.sets_home}</span>
            : null }

        </div>
        <div className='text-gray-1 bg-yellow-2 p-4 ellipsis text-shadow flex justify-between'>
          <RouterLink className='text-white truncate' to={`/teams/${match.home.id}/`}>{match.home.name}</RouterLink>
          { match.result
            ? <span className='text-3xl'>{match.result.sets_away}</span>
            : null }
        </div>
        <div className='bg-gray-3 text-gray-1 text-right pr-2 pb-0 text-sm'>
          {children}
        </div>
      </div>
    </div>
  )
}

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

export function PageTitle ({ children, className = '', style = {} }) {
  return <h1 style={style} className={`${className} text-2xl mb-4 font-head uppercase block`}>{children}</h1>
}

export function PageSubtitle ({ children }) {
  return <div className='text-xs -mt-4'>{children}</div>
}

export function H2 ({ children }) {
  return <h2 className='text-xl my-2 font-subhead inline-block'>{children}</h2>
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
      className='float bg-yellow-2 hover:bg-yellow-3 text-gray-3 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
      type={props.type || 'button'}
      onClick={props.onClick}>
      {children}
    </button>
  )
}

export function UtilityButton ({ children, ...props }) {
  return (
    <button
      className={`${utilityButtonString} ${props.className || ''}`}
      type={props.type || 'button'}
      onClick={props.onClick}>
      {children}
    </button>
  )
}

export function Select ({ children, ...props }) {
  return (
    <select
      className={`shadow inline-block appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${props.className}`}
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

  return <span className={`${className} text-red-500`}>{msg}</span>
}
