import React from 'react'
import moment from 'moment-timezone'

function MatchList ({ matches = [] }) {
  return (
    <>
      { matches.length > 0
        ? matches.map((match) => (
          <div key={`${match.start_time}-${match.home.name}-${match.away.name}`}>
            <h3 className='text-lg'><strong className='text-yellow-3'>{match.home.name}</strong> <em className='text-sm'>({match.home.wins} - {match.home.losses})</em> vs. <strong className='text-blue-3'>{match.away.name}</strong> <em className='text-sm'>({match.away.wins} - {match.away.losses})</em> </h3>
            <a className='block' rel='noreferrer' target='_blank' href={match.primary_caster.stream_link}>{match.primary_caster.name} ft. {match.secondary_casters.join(', ')}</a>
            <span className='text-sm'>{moment(match.start_time).tz('America/New_York').format('MM/DD/YYYY h:mm a')} ET</span>
          </div>
        ))
        : <h3 className='text-lg'>No scheduled matches at this time</h3>
      }
    </>
  )
}

export default MatchList
