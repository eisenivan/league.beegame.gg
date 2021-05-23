import React from 'react'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'

export const utilityButtonString = 'uppercase bg-blue-3 hover:bg-blue-900 text-white py-1 px-2 text-center font-head text-xs'
export const linkString = 'hover:text-yellow-2 transition-colors'

export function MatchBox ({ match, children }) {
  return (
    <div key={`${match.home.name}${match.id}`} className='max-w-lg mt-1 mb-4 shadow-xl'>
      <div className='text-lg uppercase md:text-2xl font-head'>
        
        <div className='flex justify-between p-4 truncate text-gray-1 bg-blue-2 text-shadow shadow-match'>
          {
            match.away
          ? <RouterLink className='flex items-center text-white truncate' to={`/teams/${match.away.id}/`}>
            <span className='truncate'>
              {match.away.name}
            </span>
          </RouterLink>
          : <span>Bye Match</span>
          }
          <div class="flex items-center flex-shrink-0">
          { match.result && match.away && match.result.winner === match.away.name
              ? <img className="flex-shrink-0 inline-block h-8 ml-2" src="/img/trophy_med.png"></img>
              : null
            }

          { match.result
            ? <span className='ml-2 text-xl md:text-3xl'>{match.result.sets_away}</span>
            : null }
          </div>

        </div>
        <div className='flex justify-between p-4 text-gray-1 bg-yellow-2 ellipsis text-shadow shadow-match'>
          <RouterLink className='flex items-center text-white truncate' to={`/teams/${match.home.id}/`}>
            <span className='truncate'>
              {match.home.name}
            </span>

          </RouterLink>

          <div class="flex items-center flex-shrink-0">

          { match.result && match.result.winner === match.home.name
              ? <img className="flex-shrink-0 inline-block h-8" src="/img/trophy_med.png"></img>
              : null
            }

          { match.result
            ? <span className='ml-2 text-xl md:text-3xl'>{match.result.sets_home}</span>
            : null }
          </div>
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
