import React from 'react'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'

export const utilityButtonString = 'uppercase bg-blue-3 hover:bg-blue-900 text-white py-1 px-2 text-center font-head text-xs'
export const linkString = 'hover:text-yellow-2 transition-colors'

export function MatchBox ({ match, children }) {
  return (
    <div key={`${match.home.name}${match.away.name}${match.id}`} className='max-w-lg mt-1 mb-4 shadow-xl'>
      <div className='text-2xl uppercase font-head'>
        <div className='flex justify-between p-4 truncate text-gray-1 bg-blue-2 text-shadow shadow-match'>
          <RouterLink className='text-white truncate flex items-center' to={`/teams/${match.away.id}/`}>
            <span class='truncate flex items-center'>
              {match.away.name}
            </span>
            { match.result && match.result.winner === match.away.name
              ? <svg class='h-5 ml-1 text-yellow-3 flex-shrink-0 inline-block' xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 1456.2 1161.79'><def /><path class='' fill='currentColor' d='M1360.56 626.71c127.52-127.52 127.52-335 0-462.51a325.16 325.16 0 00-107.75-71.57q2-27.11 2.84-54.35A37.21 37.21 0 001218.4 0H237.8a37.21 37.21 0 00-37.25 38.28q.82 27.23 2.84 54.35A325.16 325.16 0 0095.64 164.2c-127.52 127.52-127.52 335 0 462.51 62.66 62.67 189.09 139.61 307.44 187.1 46.74 18.76 100 36.14 152.16 44.45a1210.29 1210.29 0 01-147.7 253.48c-15.48 20.39-1.27 50 24 50h593.16c25.25 0 39.46-29.65 24-50A1210.29 1210.29 0 01901 858.26c52.11-8.31 105.43-25.69 152.16-44.45 118.31-47.49 244.73-124.43 307.4-187.1zM166.83 555.52c-88.26-88.26-88.26-231.87 0-320.13a225.73 225.73 0 0148.7-37C247.16 400.98 325 588.84 430.2 716.17c-115.29-47.83-219.05-116.28-263.37-160.65zm1073.84-357.16a225.73 225.73 0 0148.7 37c88.26 88.26 88.26 231.87 0 320.13-44.27 44.4-148.08 112.85-263.37 160.65 105.2-127.33 183.04-315.19 214.67-517.78z' /></svg>
              : null
            }

          </RouterLink>

          { match.result
            ? <span className='ml-2 text-3xl'>{match.result.sets_away}</span>
            : null }

        </div>
        <div className='flex justify-between p-4 text-gray-1 bg-yellow-2 ellipsis text-shadow shadow-match'>
          <RouterLink className='text-white truncate flex items-center' to={`/teams/${match.home.id}/`}>
            <span class='truncate flex items-center'>
              {match.home.name}
            </span>
            { match.result && match.result.winner === match.home.name
              ? <svg class='h-5 ml-1 text-blue-3 flex-shrink-0 inline-block' xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 1456.2 1161.79'><def /><path class='' fill='currentColor' d='M1360.56 626.71c127.52-127.52 127.52-335 0-462.51a325.16 325.16 0 00-107.75-71.57q2-27.11 2.84-54.35A37.21 37.21 0 001218.4 0H237.8a37.21 37.21 0 00-37.25 38.28q.82 27.23 2.84 54.35A325.16 325.16 0 0095.64 164.2c-127.52 127.52-127.52 335 0 462.51 62.66 62.67 189.09 139.61 307.44 187.1 46.74 18.76 100 36.14 152.16 44.45a1210.29 1210.29 0 01-147.7 253.48c-15.48 20.39-1.27 50 24 50h593.16c25.25 0 39.46-29.65 24-50A1210.29 1210.29 0 01901 858.26c52.11-8.31 105.43-25.69 152.16-44.45 118.31-47.49 244.73-124.43 307.4-187.1zM166.83 555.52c-88.26-88.26-88.26-231.87 0-320.13a225.73 225.73 0 0148.7-37C247.16 400.98 325 588.84 430.2 716.17c-115.29-47.83-219.05-116.28-263.37-160.65zm1073.84-357.16a225.73 225.73 0 0148.7 37c88.26 88.26 88.26 231.87 0 320.13-44.27 44.4-148.08 112.85-263.37 160.65 105.2-127.33 183.04-315.19 214.67-517.78z' /></svg>
              : null
            }

          </RouterLink>
          { match.result
            ? <span className='text-3xl'>{match.result.sets_home}</span>
            : null }
        </div>
        <div className='flex items-center justify-end p-2 pb-2 text-sm text-right bg-gray-3 text-gray-1'>
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

export function PageSubtitle ({ children, style = {} }) {
  return <div style={style} className='-mt-4 text-xs'>{children}</div>
}

export function H2 ({ children, className = '', style = {} }) {
  return <h2 style={style} className={`${className} inline-block my-2 text-xl font-subhead`}>{children}</h2>
}

export function H3 ({ children }) {
  return <h3 className='inline-block my-2 text-xl font-subhead'>{children}</h3>
}

export function LightContentBox ({ children }) {
  return <div className='p-4 bg-triangle_bg_light lg:p-8'>{children}</div>
}

export function Input ({ ...props }) {
  return (
    <input
      className='inline-block px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
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
      className='px-4 py-2 font-bold rounded float bg-yellow-2 hover:bg-yellow-3 text-gray-3 focus:outline-none focus:shadow-outline'
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

export function CenterContent ({ children }) {
  return (
    <div className='max-w-md m-auto'>
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
