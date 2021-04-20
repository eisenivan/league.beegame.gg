import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageTitle, PageSubtitle, H3, AvatarContainer } from '../components/elements'
import Chrome from '../components/Chrome'
import SingleTeam from '../components/SingleTeam'
import fetch from '../modules/fetch-with-headers'
import getApiUrl from '../modules/get-api-url'
import handleError from '../modules/handle-error'
import cookie from "react-cookies";

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

  const token = cookie.load('token', true)

  return (
    <Chrome>
      {
        loading
          ? <div>loading...</div>
          : (
            <div className='md:grid md:grid-cols-content'>
              <div>
                { player.avatar_url
                  ? <AvatarContainer alt={`Avatar for BGL player ${player.name}`} imgUrl={player.avatar_url} className='w-16 h-16 mb-1 rounded md:w-32 md:h-32 bg-gray-2 lg:mr-8 lg:mb-0 lg:float-left' />
                  : null }
                <div className='flex flex-col mb-0 md:flex-row'>
                  
                  <div class="-mb-3 md:mb-0">
                    <PageTitle className="break-all">{player.name}</PageTitle>
                  </div>
                  
                  {token && player.discord_username && player.discord_username.trim().length > 0
                    ? (
                      <div className='pt-1 text-xs text-blue-4 md:text-sm md:ml-10'>
                        <img src='/img/Discord-Logo-Color.png' className='inline h-5 mr-1 md:h-6' alt='Discord Username' />
                        {player.discord_username.trim()}
                      </div>
                    ) : null }
                </div>
                <div class="mt-4 md:mt-0">
                  <PageSubtitle>
                    {player.name_phonetic || ''} {player.pronouns ? `(${player.pronouns})` : ''}
                  </PageSubtitle>
                </div>

                <div className='my-4 md:pr-10'>{player.bio}</div>
              </div>
              <div className='clear'>
                <H3 className>Teams</H3>
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
