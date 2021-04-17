import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageTitle, PageSubtitle, H3, AvatarContainer } from '../components/elements'
import Chrome from '../components/Chrome'
import SingleTeam from '../components/SingleTeam'
import fetch from '../modules/fetch-with-headers'
import getApiUrl from '../modules/get-api-url'
import handleError from '../modules/handle-error'

function Profile () {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [player, setPlayer] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${getApiUrl()}players/${id}/?format=json`)
        .then(data => data.json())
        .catch(handleError)

      setPlayer(response)
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
            <div className='grid grid-cols-content'>
              <div>
                { player.avatar_url
                  ? <AvatarContainer alt={`Avatar for BGL player ${player.name}`} imgUrl={player.avatar_url} className='w-32 h-32 mb-4 bg-gray-2 lg:mr-8 lg:mb-0 lg:float-left' />
                  : null }
                <PageTitle>{player.name}</PageTitle>
                <PageSubtitle>
                  {player.name_phonetic || ''} {player.pronouns ? `(${player.pronouns})` : ''}</PageSubtitle>
                <div className='my-4'>{player.bio}</div>
              </div>
              <div className='clear'>
                <H3>Teams</H3>
                { player.teams.map(x => (
                  <div key={x.id}>
                    <SingleTeam className='text-md' team={x} />
                  </div>
                ))}
              </div>
            </div>
          )
      }
    </Chrome>
  )
}

export default Profile
