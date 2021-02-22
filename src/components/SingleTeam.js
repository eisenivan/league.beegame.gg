import React from 'react'

const borderStyle = 'border-b-2 border-gray-1 border-dotted'

function SingleTeam ({ team }) {
  return (
    <>
      <h3 className='text-xl'>{team.name}</h3>
      <ul className='ml-4'>
        <li className={`${borderStyle} cursor-help`} title={`${team.captain.name_phonetic} (${team.captain.pronouns})`}>⭐️ {team.captain.name}</li>

        {team.members.map((member) => (
          <li key={`${team.name}-${member.name}`} className={`${borderStyle} cursor-help`} title={`${member.name_phonetic} (${member.pronouns})`}>{member.name}</li>
        ))}
      </ul>
    </>
  )
}

export default SingleTeam
