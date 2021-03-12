import React from 'react'
import { Link } from 'react-router-dom'

const toolTip = 'cursor-help border-b-2 border-gray-300 border-dotted'

function buildTooltipString (person = {}) {
  return [person.name_phonetic, person.pronouns ? `(${person.pronouns})` : null]
    .filter(x => x)
    .join(' ')
}

function PlayerCard ({ children, img = '', name = '' }) {
  return (
    <div className='p-2 w-full h-20 flex'>
      <div className='bg-gray-2 h-16 w-16 mr-2' />
      <span className='text-gray-3 font-head font-lg uppercase'>{name}</span>
    </div>
  )
}

export function TeamRoster ({ team = {}, vertical, className = '' }) {
  return (
    <div className={`${className} grid grid-cols-2 gap-4"`}>
      { team.captain
        ? (
          <PlayerCard name={team.captain.name}>
            <Link
              to={`/player/${team.captain.id}`}
              className={`${(buildTooltipString(team.captain)) ? toolTip : ''} m-1`}
              title={buildTooltipString(team.captain)}>
                ⭐️ {team.captain.name}
            </Link>
          </PlayerCard>
        )
        : null }

      {team.members
        // filter out team captain if we have a team captain object
        .filter(x => team.captain && x.name !== team.captain.name)
        .map((member) => {
          return (
            <PlayerCard key={`${team.name}-${member.name}`} name={member.name}>
              <Link
                to={`/player/${member.id}`}
                key={`${team.name}-${member.name}`}
                className={`${(buildTooltipString(member)) ? toolTip : ''} m-1`}
                title={buildTooltipString(member)} />
            </PlayerCard>
          )
        })}
    </div>
  )
}

function SingleTeam ({ team, className }) {
  return (
    <div>
      <Link to={`/teams/${team.id}`} className={className || 'text-xl mb-4'}>{team.name}</Link>
      { team.members
        ? <TeamRoster team={team} />
        : null }

    </div>
  )
}

export default SingleTeam
