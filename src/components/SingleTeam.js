import React from 'react'
import { Link } from 'react-router-dom'
import { AvatarContainer, PageSubtitle } from './elements'

function PlayerCard ({ children, id, img = '', name = '', imgUrl, captain, pronouns }) {
  return (
    <Link to={`/player/${id}`} className='flex w-full h-20 p-2 hover:bg-yellow-2'>
      <AvatarContainer alt={`Avatar for BGL player ${name}`} imgUrl={imgUrl} className='flex-shrink-0 w-16 h-16 mr-2 bg-gray-2' />
      <div>
        <div className='uppercase break-all text-gray-3 font-head font-lg'>{captain ? '🌟' : ''}{name}</div>
        <div className='text-xs text-gray-3'>{pronouns}</div>
      </div>
    </Link>
  )
}

export function TeamRoster ({ team = {}, vertical, className = '' }) {
  return (
    <div style={{ gridTemplateRows: 'repeat(4, 85px)' }} className={`${className} grid md:grid-cols-2 gap-4"`}>
      { team.captain
        ? (
          <PlayerCard name={team.captain.name} id={team.captain.id} imgUrl={team.captain.avatar_url} pronouns={team.captain.pronouns} captain />
        )
        : null }

      {team.members
        // filter out team captain if we have a team captain object
        .filter(x => team.captain && x.name !== team.captain.name)
        .map((member) => {
          return (
            <PlayerCard id={member.id} key={`${team.name}-${member.name}`} name={member.name} imgUrl={member.avatar_url} pronouns={member.pronouns} />
          )
        })}
    </div>
  )
}

function SingleTeam ({ team, className, showRoster }) {
  return (
    <div>
      { team.circuit_display
        ? <PageSubtitle style={{ marginTop: '0rem', marginBottom: '-0.25rem' }}>{team.circuit_display}</PageSubtitle>
        : null }
      <Link to={`/teams/${team.id}/`} className={className || 'text-xl mb-4'}>{team.name}</Link>
      { team.members && showRoster
        ? <TeamRoster team={team} />
        : null }

    </div>
  )
}

export default SingleTeam
