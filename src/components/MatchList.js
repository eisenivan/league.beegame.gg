import React from 'react'
import guessLocalTz from '../modules/guess-local-tz'
import { DATE_TIME_FORMAT } from '../constants'

function MatchList ({ matches = [] }) {
  return (
    <>
      { matches.length > 0
        ? matches.map((match) => (
          <div key={`${match.start_time}-${match.home.name}-${match.away.name}`}>
            <h3 className='text-lg'><strong className='text-yellow-3'>{match.home.name}</strong> <em className='text-sm'>({match.home.wins || 0} - {match.home.losses || 0})</em> vs. <strong className='text-blue-3'>{match.away.name}</strong> <em className='text-sm'>({match.away.wins || 0} - {match.away.losses || 0})</em> </h3>
            {
              match.primary_caster
                ? (
                  <a className='block' rel='noreferrer' target='_blank' href={match.primary_caster.stream_link}>{match.primary_caster.name} ft. {match.secondary_casters.join(', ')}</a>
                ) : null
            }

            {
              match.start_time
                ? (
                  <span className='text-sm'>{guessLocalTz(match.start_time).format(DATE_TIME_FORMAT)}</span>
                ) : null
            }

          </div>
        ))
        : <h3 className='text-lg'>No scheduled matches at this time</h3>
      }
    </>
  )
}

export default MatchList
