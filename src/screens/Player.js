import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageTitle, PageSubtitle, H3 } from '../components/elements'
import Chrome from '../components/Chrome'
import fetch from '../modules/fetch-with-headers'

function Profile () {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [player, setPlayer] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://kqb.buzz/api/players/${id}/?format=json`) // eslint-disable-line
      const json = await response.json()
      setPlayer(json)
      setLoading(false)
    }

    fetchData()
  }, [id])

  return (
    <Chrome>
      {
        loading
          ? <div>loading...</div>
          : (
            <div>
              <PageTitle>{player.name}</PageTitle>
              <PageSubtitle>
                {player.name_phonetic || ''} {player.pronouns ? `(${player.pronouns})` : ''}</PageSubtitle>
              <hr className='my-4' />
              <H3>Teams</H3>
              { player.teams.map(x => (
                <div key={x.id}>
                  {x.name}
                </div>
              ))}
            </div>
          )
      }
    </Chrome>
  )
}

export default Profile
