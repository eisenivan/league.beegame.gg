import React, { useState, useEffect } from 'react'
import get from 'lodash.get'
import { PageTitle, PageSubtitle, H2 } from '../components/elements'
import Chrome from '../components/Chrome'
import SingleTeam from '../components/SingleTeam'
import fetch from '../modules/fetch-with-headers'
import handleError from '../modules/handle-error'
import cookie from 'react-cookies'

// function getAwardEmoji (str) {
//   switch (str) {
//     case 'Queen of the Hive':
//       return '👑'

//     case 'Eternal Warrior':
//       return '⚔'

//     case 'Purple Heart':
//       return '💜'

//     case 'Berry Bonanza':
//       return '🍒'

//     case 'Snail Whisperer':
//       return '🐌'

//     case 'Triple Threat':
//       return '♻'

//     default:
//       return ''
//   }
// }

function Profile () {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState([])
  const [tokenButtonText, setTokenButtonText] = useState('📋')

  useEffect(() => {
    const fetchData = async () => {
      const profile = await fetch('https://api-staging.beegame.gg/me/?format=json')
        .then(data => data.json())
        .catch(handleError)

      setProfile(profile)
      setLoading(false)
    }

    fetchData()
  }, [])

  // Function to copy user token to clipboard on button click
  async function HandleTokenCopy (e) {
    e.preventDefault()
    // Load token from cookies
    try {
      const token = cookie.load('token', true)
      // use navigator API for clipboard write
      await navigator.clipboard.writeText(token)
      // Display checkmark on successful copy
      setTokenButtonText('✅')
      // Reset to clipboard icon after 1 second
      setTimeout(() => setTokenButtonText('📋'), 1000)
    } catch (err) {
      // Somehow if we fail we tell the user it didn't work
      setTokenButtonText('❌')
      setTimeout(() => setTokenButtonText('📋'), 1000)
    }
  }

  // const awards = profile.player.
  if (!loading && !profile) {
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
              <PageTitle>{profile.first_name}</PageTitle>
              <span />
              <button
                className='float bg-yellow-2 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline'
                type='submit'
                onClick={HandleTokenCopy}>
                {tokenButtonText}
              </button>
              <PageSubtitle>{profile.player.name_phonetic} ({profile.player.pronouns})</PageSubtitle>
              <p className='italic mt-2'>{profile.player.bio}</p>

              { get(profile, 'player.teams')
                ? (
                  <>
                    <H2>Teams</H2>
                    { profile.player.teams.map(x => (
                      <div key={`${x.id}-${x.name}`} className='my-2'>
                        <SingleTeam className='text-md' team={x} />
                        {/* {
                    get(x.members.find(y => y.name === profile.player.name), 'award_summary', [])
                      .map(x => <span key={`${x.id}-${x.name}`} className='mr-2'>{getAwardEmoji(x.name)}<span className='text-xs italic'>x{x.count}</span></span>)
                  } */}
                      </div>
                    ))}
                  </>
                ) : null}

            </div>
          )
      }
    </Chrome>
  )
}

export default Profile
