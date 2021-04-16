import React, { useState, useEffect } from 'react'
import get from 'lodash.get'
import { PageTitle, PageSubtitle, H2, H3, UtilityButton } from '../components/elements'
import Chrome from '../components/Chrome'
import SingleTeam from '../components/SingleTeam'
import fetch from '../modules/fetch-with-headers'
import getApiUrl from '../modules/get-api-url'
import handleError from '../modules/handle-error'
import cookie from 'react-cookies'

function Profile () {
  const [loading, setLoading] = useState(true)
  const [editProfile, setEditProfile] = useState(false)
  const [profile, setProfile] = useState([])
  const [pronouns, setPronouns] = useState('')
  const [bio, setBio] = useState()
  const [tokenButtonText, setTokenButtonText] = useState('copy auth token')

  function toggleEditProfile () {
    setEditProfile(!editProfile)
  }

  useEffect(() => {
    const fetchData = async () => {
      const profile = await fetch(`${getApiUrl()}me/?format=json`)
        .then(data => data.json())
        .catch(handleError)

      setProfile(profile)
      setPronouns(profile.player.pronouns)
      setBio(profile.player.bio)
      setLoading(false)
    }

    fetchData()
  }, [])

  async function handleSubmit (e) {
    e.preventDefault()

    const data = { bio, pronouns }
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }

    fetch(`${getApiUrl()}players/${profile.player.id}/`, requestOptions)
      .then(res => res.json())
      .then((res) => {
        setPronouns(res.pronouns)
        setBio(res.bio)
        toggleEditProfile()
      })
      .catch(handleError)
  }

  // Function to copy user token to clipboard on button click
  async function handleTokenCopy (e) {
    e.preventDefault()
    // Load token from cookies
    try {
      const token = cookie.load('token', true)
      // use navigator API for clipboard write
      await navigator.clipboard.writeText(token)
      // Display checkmark on successful copy
      setTokenButtonText('✅')
      // Reset to clipboard icon after 1 second
      setTimeout(() => setTokenButtonText('copy auth token'), 1000)
    } catch (err) {
      // Somehow if we fail we tell the user it didn't work
      setTokenButtonText('❌')
      setTimeout(() => setTokenButtonText('copy auth token'), 1000)
    }
  }

  // const awards = profile.player.
  if (!loading && !profile) {
    return (
      <Chrome>
        <div>You must <a href={`${getApiUrl()}accounts/discord/login/`}>login</a> to view your profile</div>
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
              <div className='flex items-center'>
                <PageTitle className='truncate max-w-xs sm:max-width-sm md:max-w-full' style={{ marginBottom: 0 }}>{profile.player.name}</PageTitle>
                {!editProfile
                  ? (
                    <UtilityButton
                      className='ml-2'
                      type='button'
                      onClick={toggleEditProfile}>
                      Edit Profile
                    </UtilityButton>
                  ) : null }

                <UtilityButton
                  className='ml-2'
                  type='button'
                  onClick={handleTokenCopy}>
                  {tokenButtonText}
                </UtilityButton>
              </div>

              {
                editProfile
                  ? (
                    <div className='flex flex-col'>
                      <input
                        className='shadow inline-block appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        placeholder='Pronouns'
                        name='pronouns'
                        value={pronouns}
                        onChange={e => setPronouns(e.target.value)}
                        required />
                      <textarea
                        className='mt-2 shadow inline-block appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        onChange={e => setBio(e.target.value)}
                        value={bio} />
                      <div className='mt-2 flex'>
                        <UtilityButton type='submit' onClick={handleSubmit}>
                          Update
                        </UtilityButton>

                        <UtilityButton className={'ml-2'} onClick={toggleEditProfile}>
                          Cancel
                        </UtilityButton>
                      </div>
                    </div>
                  )
                  : (
                  <>
                    <PageSubtitle style={{ marginTop: 0 }}>{profile.player.name_phonetic} ({pronouns})</PageSubtitle>
                    <div className='grid md:grid-cols-content'>
                      <p className='italic mt-2'>{bio}</p>
                      { get(profile, 'player.teams')
                        ? (
                          <div>
                            <H2>Teams</H2>
                            <br />
                            <H3>Active</H3>
                            <br />
                            { profile.player.teams.filter(x => x.is_active).map(x => (
                              <div key={`${x.id}-${x.name}`} className='my-2'>
                                <SingleTeam className='text-md' team={x} />
                              </div>
                            ))}
                            <H3>Past</H3>
                            { profile.player.teams.filter(x => !x.is_active).map(x => (
                              <div key={`${x.id}-${x.name}`} className='my-2'>
                                <SingleTeam className='text-md' team={x} />
                              </div>
                            ))}
                          </div>
                        ) : null}
                    </div>
                  </>
                  )
              }

            </div>
          )
      }
    </Chrome>
  )
}

export default Profile
