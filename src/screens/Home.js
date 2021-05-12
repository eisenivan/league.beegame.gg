import React, { useState, useEffect } from 'react'
import moment from 'moment'
import get from 'lodash.get'
import ReactTwitchEmbedVideo from 'react-twitch-embed-video'
import cookie from 'react-cookies'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import fetch from '../modules/fetch-with-headers'
import { formatTime, formatDateTime } from '../modules/guess-local-tz'
import getApiUrl from '../modules/get-api-url'
import Chrome from '../components/Chrome'
import Loading from '../components/Loading'
import handleError from '../modules/handle-error'
import { PageTitle, MatchBox, linkString } from '../components/elements'
import SingleTeam from '../components/SingleTeam'

const DayColumn = styled.div``

const CalendarDark = styled.div`
  box-shadow: 0px 0px 35px -16px rgba(0, 0, 0, 0.75);
  color: #363b41;
  background-image: linear-gradient(-222deg, #222, #111);
  color: #fff;
`

const CalendarEvents = styled.div`
  color: white;
`

const EventItem = styled.div`
  padding: 5px;
`

function highlightCurrentDay (dayOffset = 0, roundOffset = 0) {
  return moment().format('M/D') === moment().startOf('isoweek').add(roundOffset * 7, 'days').add(dayOffset, 'days').format('M/D')
    ? 'bg-blue-700 text-white'
    : 'bg-blue-3 text-blue-200'
}

function highlightCurrentDayHeader (dayOffset = 0, roundOffset = 0) {
  return moment().format('M/D') === moment().startOf('isoweek').add(roundOffset * 7, 'days').add(dayOffset, 'days').format('M/D')
    ? 'text-blue-300'
    : 'text-blue-4'
}

function SingleEvent ({ event }) {
  return (
    <EventItem key={`${event.home.name}-${event.away.name}-${event.start_time}`}>
      <p className='py-1 pl-1 text-xs text-yellow-1'>{formatTime(event.start_time)}</p>
      <div class='inline-block rounded px-2 py-1 bg-gray-2 text-gray-400 w-full'>

        { event.circuit
          ? <p className='mt-1 text-gray-500 uppercase text-2xs'><Link className='text-gray-500' to={`/circuits/${event.circuit.id}/`}>{event.circuit.name} Circuit</Link></p>
          : null }

        <p className='inline-block px-1 py-1 -ml-1 text-xs font-bold text-white'>
          <Link className='text-white' to={`/teams/${event.away.id}/`}>{event.away.name}</Link> vs. <Link className='text-white' to={`/teams/${event.home.id}/`}>{event.home.name}</Link>
        </p>

        { event.primary_caster
          ? <a target='_blank' rel='noreferrer' className='flex items-center text-xs leading-loose text-purple-400' href={event.primary_caster.stream_link}><svg class='mr-1 w-3 h-3' fill='currentColor' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'> <defs /> <path fill-rule='evenodd' d='M2.149 0L.537 4.119v16.836h5.731V24h3.224l3.045-3.045h4.657l6.269-6.269V0H2.149zm19.164 13.612l-3.582 3.582H12l-3.045 3.045v-3.045H4.119V2.149h17.194v11.463zm-3.582-7.343v6.262h-2.149V6.269h2.149zm-5.731 0v6.262H9.851V6.269H12z' clip-rule='evenodd' /></svg>{event.primary_caster.name}</a>
          : <p className='text-xs italic'>Looking for caster</p> }

        { event.result
          ? <p className='flex items-center justify-center w-1/2 px-1 py-1 my-2 ml-auto mr-auto font-bold text-center text-white border border-gray-700 rounded-full md:mt-2 md:mb-1 md:w-full text-2xs'>
            <span className='pl-2 mr-2 -ml-1'>🏆</span>
            <span className='pr-1'>{event.result.winner}</span>
          </p>
          : ''
        }

      </div>
    </EventItem>
  )
}

function TvGuide ({ schedule, roundOffset = 0, loading, scheduleWarning = null }) {
  return (
    <div style={{ backgroundImage: 'repeating-linear-gradient(45deg, #202020, #202020 30px, #222 30px, #222 60px)' }} className='grid grid-cols-1 shadow-lg md:grid-cols-2 lg:grid-cols-7 md:rounded-t-md'>
      <DayColumn>
        <div className={`p-1 mt-1 font-bold text-center border-b border-gray-800 md:mt-0 md:p-2 md:rounded-tl-md md:border-none ${highlightCurrentDay(0, roundOffset)}`}>
          <div className={`text-xs uppercase ${highlightCurrentDayHeader(0, roundOffset)}`}>{moment().startOf('isoweek').add(roundOffset * 7, 'days').format('ddd')}</div>
          <div>{moment().startOf('isoweek').add(roundOffset * 7, 'days').format('M/D')}</div>
        </div>
        <CalendarDark>
          <CalendarEvents>
            { get(schedule, `[${moment().startOf('isoweek').add(roundOffset * 7, 'days').format('YYYYMMDD')}]`, []).map((event) => {
              return (
                <SingleEvent key={`${event.home.name}-${event.away.name}-${event.start_time}`} event={event} />
              )
            })}
          </CalendarEvents>
        </CalendarDark>
      </DayColumn>
      <DayColumn>
        <div className={`p-1 mt-1 font-bold text-center border-b border-gray-800 md:mt-0 md:p-2 md:border-none ${highlightCurrentDay(1, roundOffset)}`}>
          <div className={`text-xs uppercase ${highlightCurrentDayHeader(1, roundOffset)}`}>{moment().startOf('isoweek').add(roundOffset * 7, 'days').add(1, 'days').format('ddd')}</div>
          <div>{moment().startOf('isoweek').add(roundOffset * 7, 'days').add(1, 'days').format('M/D')}</div>
        </div>
        <CalendarDark>
          <CalendarEvents>
            { get(schedule, `[${moment().startOf('isoweek').add(roundOffset * 7, 'days').add(1, 'days').format('YYYYMMDD')}]`, []).map((event) => {
              return (
                <SingleEvent key={`${event.home.name}-${event.away.name}-${event.start_time}`} event={event} />
              )
            })}
          </CalendarEvents>
        </CalendarDark>
      </DayColumn>
      <DayColumn>
        <div className={`p-1 mt-1 font-bold text-center border-b border-gray-800 md:mt-0 md:p-2 md:border-none ${highlightCurrentDay(2, roundOffset)}`}>
          <div className={`text-xs uppercase ${highlightCurrentDayHeader(2, roundOffset)}`}>{moment().startOf('isoweek').add(roundOffset * 7, 'days').add(2, 'days').format('ddd')}</div>
          <div>{moment().startOf('isoweek').add(roundOffset * 7, 'days').add(2, 'days').format('M/D')}</div>
        </div>
        <CalendarDark>
          <CalendarEvents>
            { get(schedule, `[${moment().startOf('isoweek').add(roundOffset * 7, 'days').add(2, 'days').format('YYYYMMDD')}]`, []).map((event) => {
              return (
                <SingleEvent key={`${event.home.name}-${event.away.name}-${event.start_time}`} event={event} />
              )
            })}
          </CalendarEvents>
        </CalendarDark>
      </DayColumn>
      <DayColumn>
        <div className={`p-1 mt-1 font-bold text-center border-b border-gray-800 md:mt-0 md:p-2 md:border-none ${highlightCurrentDay(3, roundOffset)}`}>
          <div className={`text-xs uppercase ${highlightCurrentDayHeader(3, roundOffset)}`}>{moment().startOf('isoweek').add(roundOffset * 7, 'days').add(3, 'days').format('ddd')}</div>
          <div>{moment().startOf('isoweek').add(roundOffset * 7, 'days').add(3, 'days').format('M/D')}</div>
        </div>
        <CalendarDark>
          <CalendarEvents>
            { get(schedule, `[${moment().startOf('isoweek').add(roundOffset * 7, 'days').add(3, 'days').format('YYYYMMDD')}]`, []).map((event) => {
              return (
                <SingleEvent key={`${event.home.name}-${event.away.name}-${event.start_time}`} event={event} />
              )
            })}
          </CalendarEvents>
        </CalendarDark>
      </DayColumn>
      <DayColumn>
        <div className={`p-1 mt-1 font-bold text-center border-b border-gray-800 md:mt-0 md:p-2 md:border-none ${highlightCurrentDay(4, roundOffset)}`}>
          <div className={`text-xs uppercase ${highlightCurrentDayHeader(4, roundOffset)}`}>{moment().startOf('isoweek').add(roundOffset * 7, 'days').add(4, 'days').format('ddd')}</div>
          <div>{moment().startOf('isoweek').add(roundOffset * 7, 'days').add(4, 'days').format('M/D')}</div>
        </div>
        <CalendarDark>
          <CalendarEvents>
            { get(schedule, `[${moment().startOf('isoweek').add(roundOffset * 7, 'days').add(4, 'days').format('YYYYMMDD')}]`, []).map((event) => {
              return (
                <SingleEvent key={`${event.home.name}-${event.away.name}-${event.start_time}`} event={event} />
              )
            })}
          </CalendarEvents>
        </CalendarDark>
      </DayColumn>
      <DayColumn>
        <div className={`p-1 mt-1 font-bold text-center border-b border-gray-800 md:mt-0 md:p-2 md:border-none ${highlightCurrentDay(5, roundOffset)}`}>
          <div className={`text-xs uppercase ${highlightCurrentDayHeader(5, roundOffset)}`}>{moment().startOf('isoweek').add(roundOffset * 7, 'days').add(5, 'days').format('ddd')}</div>
          <div>{moment().startOf('isoweek').add(roundOffset * 7, 'days').add(5, 'days').format('M/D')}</div>
        </div>
        <CalendarDark>
          <CalendarEvents>
            { get(schedule, `[${moment().startOf('isoweek').add(roundOffset * 7, 'days').add(5, 'days').format('YYYYMMDD')}]`, []).map((event) => {
              return (
                <SingleEvent key={`${event.home.name}-${event.away.name}-${event.start_time}`} event={event} />
              )
            })}
          </CalendarEvents>
        </CalendarDark>
      </DayColumn>
      <DayColumn>
        <div className={`p-1 mt-1 font-bold text-center border-b border-gray-800 md:mt-0 md:p-2 md:rounded-tr-md md:border-none ${highlightCurrentDay(6, roundOffset)}`}>
          <div className={`text-xs uppercase ${highlightCurrentDayHeader(6, roundOffset)}`}>{moment().startOf('isoweek').add(roundOffset * 7, 'days').add(6, 'days').format('ddd')}</div>
          <div>{moment().startOf('isoweek').add(roundOffset * 7, 'days').add(6, 'days').format('M/D')}</div>
        </div>
        <CalendarDark>
          <CalendarEvents>
            { get(schedule, `[${moment().startOf('isoweek').add(roundOffset * 7, 'days').add(6, 'days').format('YYYYMMDD')}]`, []).map((event) => {
              return (
                <SingleEvent key={`${event.home.name}-${event.away.name}-${event.start_time}`} event={event} />
              )
            })}
          </CalendarEvents>
        </CalendarDark>
      </DayColumn>
      { loading
        ? (
          <div className='col-span-full text-center mt-4 uppercase text-xl'>
            { scheduleWarning ? <span>{scheduleWarning}</span> : null }
            <Loading />
          </div>
        ) : null }
    </div>
  )
}

function sortEventsIntoDates (events) {
  const sorted = {}
  events.forEach((event) => {
    // check to see if we have this date
    if (sorted[`${moment(event.start_time).format('YYYYMMDD')}`]) {
      sorted[`${moment(event.start_time).format('YYYYMMDD')}`].push(event)
    } else {
      sorted[`${moment(event.start_time).format('YYYYMMDD')}`] = [event]
    }
  })

  return sorted
}

function Home () {
  const [loading, setLoading] = useState(true)
  const [tvLoading, setTvLoading] = useState(true)
  const [scheduleWarning, setScheduleWarning] = useState(true)
  const [schedule, setSchedule] = useState({})
  const [profile, setProfile] = useState({})
  const [playerMatches, setPlayerMatches] = useState({})
  const [currentRoundName, setCurrentRoundName] = useState()
  const [currentRound, setCurrentRound] = useState()
  const [roundOffset, setRoundOffset] = useState(0)
  let userId = cookie.load('userId')
  useEffect(() => {
    const fetchData = async () => {
      const promises = []

      promises.push(fetch(`${getApiUrl()}me/?format=json`)
        .then(data => data.json())
        .then(data => setProfile(data))
        .catch(handleError))

      promises.push(fetch(`${getApiUrl()}matches/?round_is_current=true&player=${userId}`)
        .then(data => data.json())
        .then(data => setPlayerMatches(data.results))
        .catch(handleError))

      Promise.all(promises).then(() => {
        setLoading(false)
      })
    }

    fetchData()
  }, [userId])

  function pageTvGuide (round) {
    setTvLoading(true)
    setScheduleWarning(null)
    setRoundOffset(round)
  }

  function handleMatch (data) {
    setCurrentRoundName(get(data, 'results[0].round.name'))
    setCurrentRound(get(data, 'results[0].round.number'))
    const sortedSchedule = sortEventsIntoDates(data.results)
    setSchedule(sortedSchedule)

    // keep showing dancing chex if there are no matches
    if (Object.keys(sortedSchedule).length === 0) {
      setScheduleWarning('No matches scheduled this week')
    } else {
      setTvLoading(false)
    }
  }

  // distinct effect for querying / paging tv guide
  useEffect(() => {
    if (roundOffset === 0) {
      fetch(`${getApiUrl()}matches/?round_is_current=true&scheduled=true&limit=100`)
        .then(data => data.json())
        .then((data) => {
          handleMatch(data)
        })
        .catch(handleError)
    } else {
      fetch(`${getApiUrl()}matches/?round=${parseFloat(currentRound) + roundOffset}&scheduled=true&limit=100&season=bronze`)
        .then(data => data.json())
        .then((data) => {
          handleMatch(data)
        })
        .catch(handleError)
    }
  }, [roundOffset]) // eslint-disable-line

  const token = cookie.load('token', true)
  return (
    <Chrome>
      {
        loading
          ? <Loading />
          : (
            <div>
              <div className='grid grid-cols-1 mb-8 sm:mt-8 md:mt-0 md:grid-cols-content'>
                <div className='max-w-lg mb-5 overflow-hidden text-center md:text-left md:mb-0'>
                  <PageTitle>
                    Check out <span class='hidden md:inline'>BeeGameLeague</span> <span class='md:hidden'>BGL</span> on Twitch
                  </PageTitle>
                  <ReactTwitchEmbedVideo targetClass='flex' height='300' layout='video' channel='BeeGameLeague' />
                </div>
                {
                  token
                    ? (
                      <div>
                        <PageTitle>Your Teams</PageTitle>
                        { get(profile, 'player.teams')
                          ? (
                            <>
                              { profile.player.teams
                                .filter(x => x.is_active)
                                .map(x => (
                                  <div key={`${x.id}-${x.name}`} className='my-2'>
                                    <SingleTeam className='text-md' team={x} />
                                  </div>
                                ))}
                            </>
                          ) : <span>You're not on any teams. <Link to='/register'>Register a new one</Link></span>}

                        <PageTitle className='mt-4'>Your Week</PageTitle>
                        { playerMatches.length
                          ? (
                            playerMatches.map((match) => (
                              <MatchBox key={`match-${match.id}`} match={match}>
                                <span className='justify-end flex-grow block text-sm'>
                                  { match.start_time
                                    ? (
                                      <>
                                        {formatDateTime(match.start_time)}
                                      </>
                                    )
                                    : <span className='block align-right'>TBD</span> }
                                </span>
                              </MatchBox>
                            ))
                          )
                          : (
                        <>
                          <div>You have no match this week</div>
                          <div className='text-xs uppercase'>(That may be because you have a Bye week)</div>
                        </>
                          )
                        }

                      </div>
                    )
                    : (
                      <div className='text-xl'>
                        <a className={`${linkString}`} href={`${getApiUrl()}accounts/discord/login/`}>Login</a> to see your upcoming matches
                      </div>
                    )
                }
              </div>

              <PageTitle className='mt-8 flex justify-between'>
                {currentRoundName ? `${currentRoundName}` : `Week of ${moment().startOf('isoweek').add(roundOffset * 7, 'days').format('M/D')}`}
                <span>
                  <button className='text-sm ml-4 px-2 bg-yellow-3' onClick={() => pageTvGuide(roundOffset - 1)}>{'<<'}</button>
                  <button className='text-sm ml-1 px-2 bg-yellow-3' onClick={() => pageTvGuide(0)}>{'Current Week'}</button>
                  <button className='text-sm ml-1 px-2 bg-yellow-3' onClick={() => pageTvGuide(roundOffset + 1)}>{'>>'}</button>
                </span>
              </PageTitle>
              <TvGuide schedule={schedule} roundOffset={roundOffset} loading={tvLoading} scheduleWarning={scheduleWarning} />
            </div>

          )
      }
    </Chrome>
  )
}

export default Home
