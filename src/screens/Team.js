import React, { useState, useEffect } from 'react'
import { not, empty } from 'regent'
import get from 'lodash.get'
import cookie from 'react-cookies'
// import DateTimePicker from 'react-datetime-picker'
import DatePicker from 'react-datepicker'
import moment from 'moment-timezone'
import Chrome from '../components/Chrome'
import { PageTitle, PageSubtitle, LightContentBox, UtilityButton, MatchBox } from '../components/elements'
import { formatDateTime } from '../modules/guess-local-tz'
import { TeamRoster } from '../components/SingleTeam'
import { useParams, useHistory, Link } from 'react-router-dom'
import fetch from '../modules/fetch-with-headers'
import getApiUrl from '../modules/get-api-url'
import handleError from '../modules/handle-error'

import 'react-datepicker/dist/react-datepicker.css'

const HAS_DYNASTY = not(empty('@dynasty'))

function Team () {
  const { id, code = null } = useParams()
  const [loading, setLoading] = useState(true)
  const [joinMsg, setJoinMsg] = useState()
  const [team, setTeam] = useState({})
  const [circuit, setCircuit] = useState({})
  const [editTeam, setEditTeam] = useState(false)
  const [matches, setMatches] = useState([])
  const [matchTime, setMatchTime] = useState({})
  const [casters, setCasters] = useState([])
  const [matchError, setMatchError] = useState()
  const [name, setName] = useState()
  const [userId, setUserId] = useState()
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [copyText, setCopyText] = useState('Copy invite url')
  const history = useHistory()

  function changeMatchTime (val, id) {
    const obj = { ...matchTime }
    obj[id] = val
    setMatchTime(obj)
  }

  function toggleEditTeam () {
    setEditTeam(!editTeam)
  }

  function onTitleChange (e) {
    return setName(e.target.value)
  }

  async function handleSubmit (e) {
    e.preventDefault()

    const data = { name }
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }

    fetch(`${getApiUrl()}teams/${id}/`, requestOptions)
      .then(res => res.json())
      .then((res) => {
        setName(res.name)
        toggleEditTeam()
      })
      .catch(handleError)
  }

  async function assignCaster (e, matchId) {
    e.preventDefault()
    let casterId = e.target.value

    if (casterId === '') {
      casterId = null
    }

    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        primary_caster: casterId
      })
    }

    fetch(`${getApiUrl()}matches/${matchId}/`, requestOptions)
      .then(res => res.json())
      .then((res) => {
        setLastUpdated(new Date())
      })
      .catch(handleError)
  }

  async function scheduleMatch (e, matchId, clear = false) {
    e.preventDefault()
    if (matchTime) {
      const data = { start_time: clear ? null : moment(matchTime[matchId]).tz('UTC').format() }
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }

      fetch(`${getApiUrl()}matches/${matchId}/`, requestOptions)
        .then(res => res.json())
        .then((res) => {
          setLastUpdated(new Date())
        })
        .catch(handleError)
    } else {
      setMatchError('You need to select date and time for your match')
    }
  }

  async function copyInviteUrl (e) {
    e.preventDefault()

    try {
      await navigator.clipboard.writeText(`${process.env.REACT_APP_NODE_ENV_APP_URL}teams/${id}/${team.invite_code}`)
      setCopyText('✅')
      // Reset to clipboard icon after 1 second
      setTimeout(() => setCopyText('Copy invite url'), 1000)
    } catch (err) {
      setCopyText('❌')
      // Reset to clipboard icon after 1 second
      setTimeout(() => setCopyText('copy auth token'), 1000)
    }
  }

  useEffect(() => {
    setUserId(cookie.load('userId'))

    const fetchData = async () => {
      const promises = []

      // fetch the basic team data
      promises.push(fetch(`${getApiUrl()}teams/${id}/`)
        .then((data) => data.json())
        .then((data) => {
          setTeam(data)
          setMatches([...data.home_matches, ...data.away_matches])

          setName(data.name)
          fetch(`${getApiUrl()}circuits/${data.circuit}/`)
            .then((data) => data.json())
            .then((data) => {
              setCircuit(data)
            })
            .catch(handleError)
        })
        .catch(handleError))

      // if this is a join team request, make call the api to attempt an add
      if (code) {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invite_code: code })
        }

        promises.push(fetch(`${getApiUrl()}teams/${id}/join/`, requestOptions)
          .then(res => res.json())
          .then(res => {
            if (res.status === 'joined team') {
              setJoinMsg('Welcome to your new team!')

              history.push({
                pathname: `/teams/${id}`
              })
            } else {
              setJoinMsg('Sorry, we could not add you to the team. Check with the team captain to make sure you\'re eligible to join')
            }
          })
          .catch(handleError))
      }

      // When all our calls have resolved
      await Promise.all(promises).then(() => {
        // Remove loading screen
        setLoading(false)
      })

      // get our casters (this is non-blocking)
      fetch(`${getApiUrl()}casters/?is_active=true&limit=30`)
        .then(data => data.json())
        .then(data => setCasters(data.results))
        .catch(handleError)
    }

    fetchData()
    // we don't want to refire on match update
  }, [id, lastUpdated, code, history])
  return (
    <Chrome>
      {
        loading
          ? <div>loading...</div>
          : (
            <div>
              <div>
                { joinMsg
                  ? <div className='bg-blue-3 text-white p-4'>{joinMsg}</div>
                  : null}

                <div style={{ backgroundImage: 'url(/img/bgl_default_banner.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} className='w-full h-80 hidden md:block' />
                <div className='grid md:grid-cols-content mb-4'>
                  <div className='flex flex-col md:flex-row items-center'>
                    <img className='w-20' alt='placeholder team logo' src='/img/bgl_default_logo.png' />
                    { editTeam
                      ? (
                        <div className='flex flex-col lg:flex-row'>
                          <input
                            className='shadow inline-block appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            placeholder='Team Name'
                            name='name'
                            value={name}
                            onChange={onTitleChange}
                            required />
                          <>
                            <UtilityButton type='submit' className={'ml-2'} onClick={handleSubmit}>
                              Update
                            </UtilityButton>

                            <UtilityButton className={'ml-2'} onClick={toggleEditTeam}>
                              Cancel
                            </UtilityButton>
                          </>
                        </div>
                      )
                      : (
                        <div className='flex flex-col'>
                          <PageTitle className='truncate max-w-xs sm:max-width-sm md:max-w-full' style={{ marginBottom: 0 }}>{name}</PageTitle>
                          { parseInt(userId) === parseInt(team.captain.id)
                          // captain only view
                            ? (
                              <div>
                                <UtilityButton onClick={toggleEditTeam}>edit team</UtilityButton>
                                <UtilityButton className={'ml-2'} onClick={copyInviteUrl}>{copyText}</UtilityButton>
                              </div>
                            )
                            : null }
                          { HAS_DYNASTY(team)
                            ? <PageSubtitle style={{ marginTop: 0 }}>Dynasty: {get(team, 'dynasty.name')}</PageSubtitle>
                            : null }
                        </div>
                      )
                    }

                  </div>

                  <div className='font-head text-lg text-right self-center'><Link className='text-white' to={`/circuits/${circuit.id}/`}>{circuit.name}</Link></div>
                </div>
              </div>

              <LightContentBox>
                <div className='grid grid-cols-1 md:grid-cols-2 md:gap-12'>
                  <TeamRoster className='mt-4' vertical team={team} />
                  <div>
                    {
                      matches.length
                        ? (
                          matches.map((match) => (
                            <MatchBox key={`match-${match.id}`} match={match}>
                              <div className='bg-gray-3 text-gray-1 p-2 text-right flex flex-row flex-wrap items-center'>
                                {parseInt(userId) === parseInt(team.captain.id) && !match.result
                                  ? (
                                    <select value={`${get(match, 'primary_caster.id')}`} onChange={(e) => assignCaster(e, match.id)} className='text-gray-3 md:lg-0 flex-shrink justify-start'>
                                      <option value=''>-- SELECT CASTER --</option>
                                      { casters.map(x => <option key={`caster-${x.id}`} value={`${x.id}`}>{x.name.substr(0, 20)}{x.name.length > 20 ? '...' : ''}</option>)}
                                    </select>
                                  ) : null }
                                { match.start_time === null && parseInt(userId) === parseInt(team.captain.id) && !match.result
                                  ? (
                                    <div className='flex-auto justify-end'>
                                      <span>
                                        {/* <DateTimePicker
                                          className='text-gray-3 bg-gray-1 text-sm'
                                          onChange={(val) => changeMatchTime(val, match.id)}
                                          value={matchTime[match.id]}
                                          maxDetail={'minute'}
                                          disableClock
                                        /> */}
                                        <DatePicker
                                          className='text-gray-3 bg-gray-1 text-sm'
                                          selected={matchTime[match.id]}
                                          onChange={(val) => changeMatchTime(val, match.id)}
                                          showTimeSelect
                                          timeFormat='p'
                                          timeIntervals={15}
                                          autoFocus={false}
                                          dateFormat="MMMM d, yyyy h:mm aa"
                                          placeholderText="Match Time (Local TZ)"
                                        />
                                        <button className='bg-yellow-1 text-gray-3 rounded-sm ml-2 px-2 py-1 text-sm font-head uppercase' onClick={(e) => scheduleMatch(e, match.id)}>Schedule</button>
                                        { matchError ? <div className='mt-2 text-red-500'>{matchError}</div> : null }
                                      </span>
                                    </div>
                                  )
                                  : (
                                    <span className='text-sm block flex-grow justify-end'>
                                      { match.start_time
                                        ? (
                                      <>
                                        {formatDateTime(match.start_time)}
                                        { parseInt(userId) === parseInt(team.captain.id) && !match.result
                                          ? <button onClick={(e) => scheduleMatch(e, match.id, true)} className='bg-yellow-1 text-gray-3 rounded-sm ml-2 px-2 py-1 text-sm font-head uppercase'>Reschedule</button>
                                          : null }
                                      </>
                                        )
                                        : <span className='block align-right'>TBD</span> }
                                    </span>
                                  )
                                }
                              </div>
                            </MatchBox>
                          )
                          )
                        )
                        : (
                            <>
                              <span>You have no match this week</span>
                              <span className='text-xs'>(That may be because you have a Bye week)</span>
                            </>
                        )
                    }
                  </div>
                </div>
              </LightContentBox>
            </div>
          )
      }
    </Chrome>
  )
}

export default Team
