import React from 'react'

const toolTip = 'cursor-help border-b-2 border-gray-300 border-dotted'

function buildTooltipString (person) {
  return [person.name_phonetic, person.pronouns ? `(${person.pronouns})` : null]
    .filter(x => x)
    .join(' ')
}

function SingleTeam ({ team }) {
  return (
    <div className='mb-4'>
      <h3 className='text-xl'>{team.name}</h3>
      <div>
        <span className={`${(buildTooltipString(team.captain)) ? toolTip : ''} m-1`} title={buildTooltipString(team.captain)}>⭐️ {team.captain.name}</span>

        {team.members
          // filter out team captain
          .filter(x => x.name !== team.captain.name)
          .map((member) => {
            return (
              <span
                key={`${team.name}-${member.name}`}
                className={`${(buildTooltipString(member)) ? toolTip : ''} m-1`}
                title={buildTooltipString(member)}>{member.name}
              </span>
            )
          })}
      </div>
    </div>
  )
}

export default SingleTeam
