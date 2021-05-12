import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import cookie from 'react-cookies'
import { PageTitle, PageSubtitle, H3, AvatarContainer } from '../components/elements'
import Chrome from '../components/Chrome'
import Loading from '../components/Loading'
import PlayerTeamList from '../components/PlayerTeamList'
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

  const token = cookie.load('token', true)

  return (
    <Chrome>
      {
        loading
          ? <Loading />
          : (
            <div className='md:grid md:grid-cols-content'>
              <div class='flex flex-col md:block items-center'>
                { player.avatar_url
                  ? <AvatarContainer alt={`Avatar for BGL player ${player.name}`} imgUrl={player.avatar_url} className='w-16 h-16 mb-1 rounded md:w-32 md:h-32 bg-gray-2 lg:mr-8 lg:mb-0 lg:float-left' />
                  : null }
                <div className='flex flex-col items-center w-full mb-0 md:items-start md:w-auto md:flex-row'>

                  <div class='-mb-3 md:mb-0'>
                    <PageTitle className='break-all'>{player.name}</PageTitle>
                  </div>

                  {token && player.discord_username && player.discord_username.trim().length > 0
                    ? (
                      <div className='text-xs md:pt-1 text-blue-4 md:text-sm md:ml-10'>
                        <img src='/img/discord_logo.svg' className='inline w-4 h-4 mr-1 md:w-5 md:h-5' alt='Discord Username' />
                        {player.discord_username.trim()}
                      </div>
                    ) : null }
                </div>
                <div class='mt-5 md:mt-0'>
                  <PageSubtitle>
                    {player.name_phonetic || ''} {player.pronouns ? `(${player.pronouns})` : ''}
                  </PageSubtitle>
                </div>

                <div className='w-full my-4 md:pr-10'>
                  { player.bio
                    ? (
                      <div>
                        <H3>Bio</H3>
                        <p class='-mt-2'>{player.bio}</p>
                      </div>
                    )
                    : null
                  }
                </div>

              </div>
              <PlayerTeamList player={player} className='clear' />
            </div>
          )
      }
    </Chrome>
  )
}

export default Profile
