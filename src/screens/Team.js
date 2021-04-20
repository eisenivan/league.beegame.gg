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
  const [matchesWon, setMatchesWon] = useState(0)
  const [matchesLost, setMatchesLost] = useState(0)
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
          setMatches([...data.home_matches, ...data.away_matches].sort((a, b) => (a.start_time > b.start_time ? 1 : -1)))
          const matchesPlayed = [...data.home_matches, ...data.away_matches].filter(m => m.result && m.result.status == 'Completed')
          const countOfMatchesWon = matchesPlayed.filter(m => m.result.winner == data.name).length
          setMatchesWon(countOfMatchesWon)
          setMatchesLost(matchesPlayed.length - countOfMatchesWon)

          const matchesPlayed = [...data.home_matches, ...data.away_matches].filter(m => m.result && m.result.status == "Completed")
          const countOfMatchesWon = matchesPlayed.filter(m => m.result.winner == data.name).length
          setMatchesWon(countOfMatchesWon)
          setMatchesLost(matchesPlayed.length - countOfMatchesWon)

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
              setJoinMsg('Sorry, we could not add you to the team. There could be a few reasons for this: 1. You need to sign in first. 2. Already on a team in this region. 3. This team is full. 4. You have already joined this team. 5. Registration has closed. 6. Invalid or expired invite link. For more help, please visit #bgl-help on the Bee Game Discord for assistance.')
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
                  ? <div className='p-4 text-white bg-blue-3'>{joinMsg}</div>
                  : null}

                <div style={{ backgroundImage: 'url(/img/bgl_default_banner.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} className='hidden w-full h-80 md:block' />
                <div className='grid mb-4 md:grid-cols-content'>
                  <div className='flex flex-col items-center md:flex-row'>
                    <img className='w-20' alt='placeholder team logo' src='/img/bgl_default_logo.png' />
                    { editTeam
                      ? (
                        <div className='flex flex-col lg:flex-row'>
                          <input
                            className='inline-block px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
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
                          <PageTitle className='max-w-xs truncate sm:max-width-sm md:max-w-full' style={{ marginBottom: 0 }}>
                            {name} ({matchesWon} - {matchesLost})
                          </PageTitle>
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

                  <div className='flex self-center justify-center text-lg text-right md:block font-head'><Link className='text-white' to={`/circuits/${circuit.id}/`}>{circuit.name}</Link></div>
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
                              <div className='flex flex-row flex-wrap items-center p-2 text-right bg-gray-3 text-gray-1'>
                                {parseInt(userId) === parseInt(team.captain.id) && !match.result
                                  ? (
                                    <select value={`${get(match, 'primary_caster.id')}`} onChange={(e) => assignCaster(e, match.id)} className='justify-start flex-shrink text-gray-3 md:lg-0'>
                                      <option value=''>-- SELECT CASTER --</option>
                                      { casters.map(x => <option key={`caster-${x.id}`} value={`${x.id}`}>{x.name.substr(0, 20)}{x.name.length > 20 ? '...' : ''}</option>)}
                                    </select>
                                  ) : null }
                                { match.start_time === null && parseInt(userId) === parseInt(team.captain.id) && !match.result
                                  ? (
                                    <div className='justify-end flex-auto'>
                                      <span>
                                        <DatePicker
                                          className='text-sm text-gray-3 bg-gray-1'
                                          selected={matchTime[match.id]}
                                          onChange={(val) => changeMatchTime(val, match.id)}
                                          showTimeSelect
                                          timeFormat='p'
                                          timeIntervals={15}
                                          autoFocus={false}
                                          dateFormat='MM/dd/yyyy h:mm aa'
                                          placeholderText={'Match Time (in ' + moment.tz(Date.now(), moment.tz.guess()).format('z') + ')'}
                                        />
                                        <button className='px-2 py-1 ml-2 text-sm uppercase rounded-sm bg-yellow-1 text-gray-3 font-head' onClick={(e) => scheduleMatch(e, match.id)}>Schedule</button>
                                        { matchError ? <div className='mt-2 text-red-500'>{matchError}</div> : null }
                                      </span>
                                    </div>
                                  )
                                  : (
                                    <span className='justify-end flex-grow block text-sm'>
                                      { match.start_time
                                        ? (
                                      <>
                                        {formatDateTime(match.start_time)}
                                        { parseInt(userId) === parseInt(team.captain.id) && !match.result
                                          ? <button onClick={(e) => scheduleMatch(e, match.id, true)} className='px-2 py-1 ml-2 text-sm uppercase rounded-sm bg-yellow-1 text-gray-3 font-head'>Reschedule</button>
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
