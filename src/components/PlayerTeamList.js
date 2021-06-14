import React from 'react'
import { H2, H3 } from './elements'

import SingleTeam from './SingleTeam'

function PlayerTeamList ({ player, className = '' }) {
  return (
    <div>
      <H2>Teams</H2>
      <br />
      <H3>Active</H3>
      <br />
      { player.teams.filter(x => x.is_active).map(x => (
        <div key={`${x.id}-${x.name}`} className='my-2'>
          <SingleTeam className='text-md' team={x} />
        </div>
      ))}
      {
        player.teams.filter(x => x.is_active).length === 0
          ? <p>None</p> : null
      }
      <H3>Past</H3>
      <br />
      { player.teams.filter(x => !x.is_active).map(x => (
        <div key={`${x.id}-${x.name}`} className='my-2'>
          <SingleTeam className='text-md' team={x} />
        </div>
      ))}
      {
        player.teams.filter(x => !x.is_active).length === 0
          ? <p>None</p> : null
      }
    </div>
  )
}

export default PlayerTeamList
