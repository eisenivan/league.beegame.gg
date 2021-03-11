import React, { useState, useEffect } from 'react'
import get from 'lodash.get'
import { PageTitle, PageSubtitle, H2 } from '../components/elements'
import Chrome from '../components/Chrome'
import SingleTeam from '../components/SingleTeam'
import fetch from '../modules/fetch-with-headers'
import handleError from '../modules/handle-error'

function getAwardEmoji (str) {
  switch (str) {
    case 'Queen of the Hive':
      return '👑'

    case 'Eternal Warrior':
      return '⚔'

    case 'Purple Heart':
      return '💜'

    case 'Berry Bonanza':
      return '🍒'

    case 'Snail Whisperer':
      return '🐌'

    case 'Triple Threat':
      return '♻'

    default:
      return ''
  }
}

function Profile () {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://api-staging.beegame.gg/api/me/?format=json')
        .catch(handleError)
      const json = await response.json()
        .catch(handleError)

      setProfile(json)
      setLoading(false)
    }

    fetchData()
  }, [])

  // const awards = profile.player.
  if (!loading && !profile.player) {
    return (
      <Chrome>
        <div>You must <a href='https://api-staging.beegame.gg/accounts/discord/login/'>login</a> to view your profile</div>
      </Chrome>
    )
  }

  return (
    <Chrome>
      {
        loading
          ? <div>loading...</div>
          : (
            <div>
              <PageTitle>{profile.player.name}</PageTitle>
              <PageSubtitle>{profile.player.name_phonetic} ({profile.player.pronouns})</PageSubtitle>

              <H2>Teams</H2>
              { profile.player.teams.map(x => (
                <div key={`${x.id}-${x.name}`} className='my-2'>
                  <SingleTeam className='text-md' team={x} />
                  {
                    get(x.members.find(y => y.name === profile.player.name), 'award_summary', [])
                      .map(x => <span key={`${x.id}-${x.name}`} className='mr-2'>{getAwardEmoji(x.name)}<span className='text-xs italic'>x{x.count}</span></span>)
                  }
                </div>
              ))}
            </div>
          )
      }
    </Chrome>
  )
}

export default Profile
