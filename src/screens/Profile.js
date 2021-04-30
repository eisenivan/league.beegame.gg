import React, { useState, useEffect } from 'react'
import get from 'lodash.get'
import { PageTitle, PageSubtitle, H3, UtilityButton, AvatarContainer, FormBox } from '../components/elements'
import Chrome from '../components/Chrome'
import PlayerTeamList from '../components/PlayerTeamList'
import fetch from '../modules/fetch-with-headers'
import getApiUrl from '../modules/get-api-url'
import handleError from '../modules/handle-error'
import cookie from 'react-cookies'
import setUserCookies from '../modules/set-tokens'

function Profile () {
  const [loading, setLoading] = useState(true)
  const [editProfile, setEditProfile] = useState(false)
  const [profile, setProfile] = useState([])
  const [namePhonetic, setNamePhonetic] = useState('')
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
      setNamePhonetic(profile.player.name_phonetic)
      setPronouns(profile.player.pronouns)
      setBio(profile.player.bio)
      setLoading(false)
    }

    fetchData()
  }, [])

  async function handleSubmit (e) {
    e.preventDefault()

    const data = { bio, pronouns }
    data.name_phonetic = namePhonetic

    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }

    fetch(`${getApiUrl()}players/${profile.player.id}/`, requestOptions)
      .then(res => res.json())
      .then((res) => {
        // If we don't patch profile here with the patched object, then backing out after first set of edits later will
        // return to an earlier value, because profile.player is used in reset.
        profile.player = res
        setProfile(profile)
        setNamePhonetic(res.name_phonetic)
        setPronouns(res.pronouns)
        setBio(res.bio)
        // refresh the cached user data
        setUserCookies()
        toggleEditProfile()
      })
      .catch(handleError)
  }

  function handleCancel (e) {
    e.preventDefault()

    // Reset all three fields
    setNamePhonetic(profile.player.name_phonetic)
    setPronouns(profile.player.pronouns)
    setBio(profile.player.bio)

    toggleEditProfile()
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
            <div class='flex flex-col md:block items-center'>
              { profile.player.avatar_url
                ? <AvatarContainer alt={`Avatar for BGL player ${profile.player.name}`} imgUrl={profile.player.avatar_url} className='w-16 h-16 mb-1 rounded md:w-32 md:h-32 bg-gray-2 lg:mr-8 lg:mb-0 lg:float-left' />
                : null }
              <div className='flex flex-col items-center mb-4 md:flex-row'>
                <PageTitle className='max-w-xs break-allmd:truncate sm:max-width-sm md:max-w-full' style={{ marginBottom: 0 }}>{profile.player.name}</PageTitle>

                <div>
                  {!editProfile
                    ? (
                      <UtilityButton
                        className='md:ml-2'
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
              </div>

              {
                editProfile
                  ? (
                    <div className='flex flex-col w-full md:w-auto'>
                      <div class='md:flex md:w-1/2'>

                        <div class='md:w-1/2 md:mr-4'>
                          <FormBox>
                            <label for='namePhonetic'>Name Phonetically</label>
                            <input
                              className='inline-block px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                              placeholder='example: beez-neez'
                              name='namePhonetic'
                              value={namePhonetic}
                              onChange={e => setNamePhonetic(e.target.value)}
                              required />
                          </FormBox>
                        </div>

                        <div class='md:w-1/2'>
                          <FormBox>
                            <label for='pronouns'>Pronouns</label>
                            <input
                              className='inline-block px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                              placeholder='Pronouns do you prefer'
                              name='pronouns'
                              value={pronouns}
                              onChange={e => setPronouns(e.target.value)}
                            />
                          </FormBox>
                        </div>

                      </div>
                      <FormBox>
                        <label for='bio'>Bio</label>
                        <textarea
                          className='inline-block px-3 py-2 mt-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline lg:w-1/2'
                          placeholder='Tell us a bit about yourself'
                          name='bio'
                          onChange={e => setBio(e.target.value)}
                          value={bio} />
                      </FormBox>
                      <div className='flex mt-2'>
                        <UtilityButton type='submit' onClick={handleSubmit}>
                          Update
                        </UtilityButton>

                        <UtilityButton className={'ml-2'} onClick={handleCancel}>
                          Cancel
                        </UtilityButton>
                      </div>
                    </div>
                  )
                  : (
                  <>
                    <PageSubtitle style={{ marginTop: 0 }}>{namePhonetic}{pronouns && <span>{' (' + pronouns + ')'}</span>}</PageSubtitle>
                    <div className='grid w-full md:w-auto md:grid-cols-content'>

                      <div className='mb-2 md:pr-10'>
                        { bio
                          ? (
                            <div>
                              <H3>Bio</H3>
                              <p class='-mt-2'>{bio}</p>
                            </div>
                          )
                          : null
                        }
                      </div>

                      { get(profile, 'player.teams')
                        ? (
                          <PlayerTeamList player={profile.player} />
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
