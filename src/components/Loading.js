import React from 'react'

function Loading ({ className = '' }) {
  return (
    <img className={`m-auto ${className}`} alt='Loading indicator: blue checkers dancing' src='/img/chex-dance.gif' />
  )
}

export default Loading
