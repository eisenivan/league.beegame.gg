import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageTitle, PageSubtitle, H3 } from '../components/elements'
import Chrome from '../components/Chrome'
import SingleTeam from '../components/SingleTeam'
import fetch from '../modules/fetch-with-headers'
import handleError from '../modules/handle-error'

function Profile () {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [player, setPlayer] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://api-staging.beegame.gg/api/players/${id}/?format=json`)
        .catch(handleError)
      const json = await response.json()
        .catch(handleError)
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
                  <SingleTeam className='text-md' team={x} />
                </div>
              ))}
            </div>
          )
      }
    </Chrome>
  )
}

export default Profile
