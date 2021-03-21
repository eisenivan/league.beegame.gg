import React, { useState, useEffect } from 'react'
import { not, empty } from 'regent'
import get from 'lodash.get'
import cookie from 'react-cookies'
import DateTimePicker from 'react-datetime-picker'
import moment from 'moment-timezone'
import Chrome from '../components/Chrome'
import { PageTitle, PageSubtitle, LightContentBox } from '../components/elements'
import guessLocalTz from '../modules/guess-local-tz'
import { DATE_TIME_FORMAT } from '../constants'
import { TeamRoster } from '../components/SingleTeam'
import { useParams } from 'react-router-dom'
import fetch from '../modules/fetch-with-headers'
import handleError from '../modules/handle-error'

const HAS_DYNASTY = not(empty('@dynasty'))

function Team () {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState({})
  const [circuit, setCircuit] = useState({})
  const [editTeam, setEditTeam] = useState(false)
  const [matches, setMatches] = useState([])
  const [matchTime, setMatchTime] = useState()
  const [matchError, setMatchError] = useState()
  const [name, setName] = useState()
  const [userId, setUserId] = useState()
  const [lastUpdated, setLastUpdated] = useState(new Date())

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

    fetch(`https://api-staging.beegame.gg/teams/${id}/`, requestOptions)
      .then(res => res.json())
      .then((res) => {
        setName(res.name)
        toggleEditTeam()
      })
      .catch(handleError)
  }

  async function scheduleMatch (e, matchId) {
    e.preventDefault()
    if (matchTime) {
      const data = { start_time: moment(matchTime).tz('UTC').format() }
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }

      fetch(`https://api-staging.beegame.gg/matches/${matchId}/`, requestOptions)
        .then(res => res.json())
        .then((res) => {
          setLastUpdated(new Date())
        })
        .catch(handleError)
    } else {
      setMatchError('You need to select date and time for your match')
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://api-staging.beegame.gg/teams/${id}/`)
        .then((data) => data.json())
        .catch(handleError)

      setTeam(response)
      setMatches([...response.home_matches, ...response.away_matches])
      setName(response.name)

      const circuit = await fetch(`https://api-staging.beegame.gg/circuits/${response.circuit}/`)
        .then((data) => data.json())
        .catch(handleError)

      setCircuit(circuit)

      setUserId(cookie.load('userid'))
      setLoading(false)
    }

    fetchData()
  }, [id, userId, lastUpdated])
  return (
    <Chrome>
      {
        loading
          ? <div>loading...</div>
          : (
            <div>

              <div>
                <div style={{ backgroundImage: 'url(/img/tb-banner.png)', backgroundSize: 'cover' }} className='w-full h-80' />
                <div className='grid grid-cols-2'>
                  <div className='flex'>
                    <img className='relative -top-8 w-16' alt='placeholder team logo' src='/img/peanut.png' />
                    { editTeam
                      ? (
                        <div className=''>
                          <input
                            className='shadow inline-block appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            placeholder='Team Name'
                            name='name'
                            value={name}
                            onChange={onTitleChange}
                            required />

                          <button
                            className='float bg-yellow-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                            type='submit'
                            onClick={handleSubmit}>
                                Update
                          </button>

                          <button
                            className='float bg-gray-1 hover:bg-blue-700 text-gray-3 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                            type='submit'
                            onClick={toggleEditTeam}>
                                Cancel
                          </button>
                        </div>
                      )
                      : (
                          <>
                            <PageTitle>{name}</PageTitle>
                            { parseInt(userId) === parseInt(team.captain.id)
                              ? <button onClick={toggleEditTeam} className='ml-2 relative -top-4 text-sm' to={`/teams/${id}/edit`}>(edit)</button>
                              : null }
                            { HAS_DYNASTY(team)
                              ? <PageSubtitle>Dynasty: {get(team, 'dynasty.name')}</PageSubtitle>
                              : null }
                          </>
                      )
                    }

                  </div>

                  <div className='font-head text-lg text-right'>{circuit.name}</div>
                </div>
              </div>

              <LightContentBox>
                <div className='lg:grid lg:grid-cols-2'>
                  <TeamRoster className='mt-4' vertical team={team} />
                  <div>
                    <PageSubtitle>Matches</PageSubtitle>
                    { matches.map(x => (
                      <div key={`${x.home.name}${x.away.name}${x.id}`} className='shadow-lg'>
                        <div className='uppercase font-head font-xl'>
                          <div className='text-gray-1 bg-blue-2 p-4 truncate'>
                            {x.away.name}
                          </div>
                          <div className='text-gray-1 bg-yellow-2 p-4 ellipsis'>
                            {x.home.name}
                          </div>

                          <div className='bg-gray-3 text-gray-1 p-4 py-2 text-right'>
                            { x.start_time === null
                              ? (
                                <>
                                  <DateTimePicker
                                    className='text-gray-3 bg-gray-1'
                                    onChange={setMatchTime}
                                    value={matchTime}
                                    maxDetail={'minute'}
                                    disableClock
                                  />
                                  <button className='bg-yellow-1 text-gray-3 rounded-sm ml-2 px-2 py-1' onClick={(e) => scheduleMatch(e, x.id)}>Schedule</button>
                                  { matchError ? <div className='mt-2 text-red-500'>{matchError}</div> : null }
                                </>
                              )
                              : (
                                <>
                                  {guessLocalTz(x.start_time).format(DATE_TIME_FORMAT)}
                                </>
                              )
                            }
                          </div>
                        </div>
                      </div>
                    )) }
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
