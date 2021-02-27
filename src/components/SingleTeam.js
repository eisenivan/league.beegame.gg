import React from 'react'
import { Link } from 'react-router-dom'

const toolTip = 'cursor-help border-b-2 border-gray-300 border-dotted'

function buildTooltipString (person = {}) {
  return [person.name_phonetic, person.pronouns ? `(${person.pronouns})` : null]
    .filter(x => x)
    .join(' ')
}

export function TeamRoster ({ team = {}, vertical, className = '' }) {
  return (
    <div className={`${className} ${vertical ? 'flex flex-col' : ''}`}>
      { team.captain
        ? <div><span className={`${(buildTooltipString(team.captain)) ? toolTip : ''} m-1`} title={buildTooltipString(team.captain)}>⭐️ {team.captain.name}</span></div>
        : null }

      {team.members
        // filter out team captain if we have a team captain object
        .filter(x => team.captain && x.name !== team.captain.name)
        .map((member) => {
          return (
            <div key={`${team.name}-${member.name}`}>
              <span
                key={`${team.name}-${member.name}`}
                className={`${(buildTooltipString(member)) ? toolTip : ''} m-1`}
                title={buildTooltipString(member)}>{member.name}
              </span>
            </div>
          )
        })}
    </div>
  )
}

function SingleTeam ({ team }) {
  return (
    <div className='mb-4'>
      <Link to={`/teams/${team.id}`} className='text-xl'>{team.name}</Link>
      { team.members
        ? <TeamRoster team={team} />
        : null }

    </div>
  )
}

export default SingleTeam
