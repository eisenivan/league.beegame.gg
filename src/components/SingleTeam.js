import React from 'react'
import { Link } from 'react-router-dom'
import { AvatarContainer } from './elements'

function PlayerCard ({ children, id, img = '', name = '', imgUrl, captain }) {
  return (
    <Link to={`/player/${id}`} className='p-2 w-full h-20 flex hover:bg-yellow-2'>
      <AvatarContainer alt={`Avatar for BGL player ${name}`} imgUrl={imgUrl} className='bg-gray-2 h-16 w-16 mr-2' />
      <span className='text-gray-3 font-head font-lg uppercase'>{captain ? '🌟' : ''}{name}</span>
    </Link>
  )
}

export function TeamRoster ({ team = {}, vertical, className = '' }) {
  return (
    <div className={`${className} grid grid-cols-2 gap-4 grid-rows-none"`}>
      { team.captain
        ? (
          <PlayerCard name={team.captain.name} id={team.captain.id} imgUrl={team.captain.avatar_url} captain />
        )
        : null }

      {team.members
        // filter out team captain if we have a team captain object
        .filter(x => team.captain && x.name !== team.captain.name)
        .map((member) => {
          return (
            <PlayerCard id={member.id} key={`${team.name}-${member.name}`} name={member.name} imgUrl={member.avatar_url} />
          )
        })}
    </div>
  )
}

function SingleTeam ({ team, className, showRoster }) {
  return (
    <div>
      <Link to={`/teams/${team.id}/`} className={className || 'text-xl mb-4'}>{team.name}</Link>
      { team.members && showRoster
        ? <TeamRoster team={team} />
        : null }

    </div>
  )
}

export default SingleTeam
