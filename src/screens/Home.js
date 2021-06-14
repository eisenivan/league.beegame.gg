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

function borderForDay (dayOffset = 0) {
  if (dayOffset === 0) {
    return 'md:rounded-tl-md'
  } else if (dayOffset === 6) {
    return 'md:rounded-tr-md'
  } else {
    return ''
  }
}

function hideDuplicatedTimestamp (currentEventStartTime, previousEventStartTime) {
  if (currentEventStartTime === previousEventStartTime) {
    return 'lg:hidden'
  } else {
    return ''
  }
}

function SingleEvent ({ event, previousEventStartTime = 0, showSpoilers = true }) {
  const [reveal, setReveal] = useState(false)
  const shouldDisplayWinner = () => showSpoilers || reveal
  return (
    <EventItem key={`${event.home.name}-${event.away.name}-${event.start_time}`}>
      <p className={`py-1 pl-1 text-xs text-yellow-1 ${hideDuplicatedTimestamp(event.start_time, previousEventStartTime)}`}>{formatTime(event.start_time)}</p>
      <div className='inline-block w-full px-2 py-1 text-gray-400 rounded bg-gray-2'>

        { event.circuit
          ? <p className='mt-1 text-gray-500 uppercase text-2xs'><Link className='text-gray-500' to={`/circuits/${event.circuit.id}/`}>{event.circuit.name} Circuit</Link></p>
          : null }

        <p className='inline-block px-1 py-1 -ml-1 text-xs font-bold text-white'>
          <Link className='text-white' to={`/teams/${event.away.id}/`}>{event.away.name}</Link> vs. <Link className='text-white' to={`/teams/${event.home.id}/`}>{event.home.name}</Link>
        </p>

        { event.primary_caster
          ? <a target='_blank' rel='noreferrer' className='flex items-center text-xs leading-loose text-purple-400' href={event.primary_caster.stream_link}><svg className='w-3 h-3 mr-1' fill='currentColor' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'> <defs /> <path fillRule='evenodd' d='M2.149 0L.537 4.119v16.836h5.731V24h3.224l3.045-3.045h4.657l6.269-6.269V0H2.149zm19.164 13.612l-3.582 3.582H12l-3.045 3.045v-3.045H4.119V2.149h17.194v11.463zm-3.582-7.343v6.262h-2.149V6.269h2.149zm-5.731 0v6.262H9.851V6.269H12z' clipRule='evenodd' /></svg>{event.primary_caster.name}</a>
          : <p className='text-xs italic'>Looking for caster</p> }

        { event.result &&
          <div className={'flex items-center justify-center w-1/2 px-1 py-1 my-2 ml-auto mr-auto font-bold text-center text-white border border-gray-700 rounded-full md:mt-2 md:mb-1 md:w-full text-2xs ' + (!shouldDisplayWinner() ? 'cursor-pointer' : '')} onClick={!shouldDisplayWinner() ? () => setReveal(true) : undefined}>
            <span className='pl-2 mr-2 -ml-1'>
              <svg className='w-3 text-yellow-3' xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 1456.2 1161.79'><def /><path className='' fill='currentColor' d='M1360.56 626.71c127.52-127.52 127.52-335 0-462.51a325.16 325.16 0 00-107.75-71.57q2-27.11 2.84-54.35A37.21 37.21 0 001218.4 0H237.8a37.21 37.21 0 00-37.25 38.28q.82 27.23 2.84 54.35A325.16 325.16 0 0095.64 164.2c-127.52 127.52-127.52 335 0 462.51 62.66 62.67 189.09 139.61 307.44 187.1 46.74 18.76 100 36.14 152.16 44.45a1210.29 1210.29 0 01-147.7 253.48c-15.48 20.39-1.27 50 24 50h593.16c25.25 0 39.46-29.65 24-50A1210.29 1210.29 0 01901 858.26c52.11-8.31 105.43-25.69 152.16-44.45 118.31-47.49 244.73-124.43 307.4-187.1zM166.83 555.52c-88.26-88.26-88.26-231.87 0-320.13a225.73 225.73 0 0148.7-37C247.16 400.98 325 588.84 430.2 716.17c-115.29-47.83-219.05-116.28-263.37-160.65zm1073.84-357.16a225.73 225.73 0 0148.7 37c88.26 88.26 88.26 231.87 0 320.13-44.27 44.4-148.08 112.85-263.37 160.65 105.2-127.33 183.04-315.19 214.67-517.78z' /></svg>
            </span>
            <span className='pr-1'>{shouldDisplayWinner() ? event.result.winner : 'Click to show winner'}</span>
          </div>
        }
      </div>
    </EventItem>
  )
}

function TvGuide ({ schedule, roundOffset = 0, loading, scheduleWarning = null, guideOptions = {} }) {
  return (
    <div style={{ backgroundImage: 'repeating-linear-gradient(45deg, #202020, #202020 30px, #222 30px, #222 60px)' }} className='grid grid-cols-1 shadow-lg md:grid-cols-2 lg:grid-cols-7 md:rounded-t-md'>
      {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => {
        return (
          <DayColumn key={dayOfWeek}>
            <div className={`p-1 mt-1 font-bold text-center border-b border-gray-800 md:mt-0 md:p-2  md:border-none ${borderForDay(dayOfWeek)} ${highlightCurrentDay(dayOfWeek, roundOffset)}`}>
              <div className={`text-xs uppercase ${highlightCurrentDayHeader(dayOfWeek, roundOffset)}`}>{moment().startOf('isoweek').add(roundOffset * 7, 'days').add(dayOfWeek, 'days').format('ddd')}</div>
              <div>{moment().startOf('isoweek').add(roundOffset * 7, 'days').add(dayOfWeek, 'days').format('M/D')}</div>
            </div>
            <CalendarDark>
              <CalendarEvents>
                { get(schedule, `[${moment().startOf('isoweek').add(roundOffset * 7, 'days').add(dayOfWeek, 'days').format('YYYYMMDD')}]`, []).map((event, idx, events) => {
                  const previousEventStartTime = idx > 0 ? events[idx - 1].start_time : -1
                  return (
                    <SingleEvent key={`${event.home.name}-${event.away.name}-${event.start_time}`} event={event} previousEventStartTime={previousEventStartTime} showSpoilers={get(guideOptions, 'showSpoilers')} />
                  )
                })}
              </CalendarEvents>
            </CalendarDark>
          </DayColumn>
        )
      })}
      { loading
        ? (
          <div className='mt-4 text-xl text-center uppercase col-span-full'>
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
  const [activeRound, setActiveRound] = useState()
  const [roundOffset, setRoundOffset] = useState(0)
  // create userGuide cookie if needed; default to `{showSpoilers: true}` to preserve existing behavior
  const [guideOptions, setGuideOptions] = useState(
    cookie.save('guideOptions', { showSpoilers: true, ...cookie.load('guideOptions') }) || cookie.load('guideOptions'))
  let userId = cookie.load('userId')
  useEffect(() => {
    const fetchData = async () => {
      const promises = []

      if (userId) {
        promises.push(fetch(`${getApiUrl()}me/?format=json`)
          .then(data => data.json())
          .then(data => setProfile(data))
          .catch(handleError))

        promises.push(fetch(`${getApiUrl()}matches/?round_is_current=true&player=${userId}`)
          .then(data => data.json())
          .then(data => setPlayerMatches(data.results))
          .catch(handleError))
      }

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
          setActiveRound(parseInt(get(data, 'results[0].round.number', 10)))
          handleMatch(data)
        })
        .catch(handleError)
    } else {
      fetch(`${getApiUrl()}matches/?round=${parseFloat(activeRound) + parseInt(roundOffset, 10)}&scheduled=true&limit=100&season=bronze`)
        .then(data => data.json())
        .then((data) => {
          handleMatch(data)
        })
        .catch(handleError)
    }
  }, [roundOffset]) // eslint-disable-line

  function handleSpoilersChange (event) {
    setGuideOptions({ ...guideOptions, showSpoilers: !event.target.checked })
  }

  // keep cookie consistent w/ user preference
  useEffect(() => {
    cookie.save('guideOptions', guideOptions)
  }, [guideOptions]) // eslint-disable-line

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
                    Check out <span className='hidden md:inline'>BeeGameLeague</span> <span className='md:hidden'>BGL</span> on Twitch
                  </PageTitle>
                  <ReactTwitchEmbedVideo targetClassName='flex' height='300' layout='video' channel='BeeGameLeague' />
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
                                <span className='flex items-center justify-end flex-grow text-sm'>

                                  { match.primary_caster
                                    ? <a target='_blank' rel='noreferrer' className='flex items-center mr-4 text-xs leading-loose text-purple-400' href={match.primary_caster.stream_link}>
                                      <svg className='w-3 h-3 mr-1' fill='currentColor' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'> <defs /> <path fillRule='evenodd' d='M2.149 0L.537 4.119v16.836h5.731V24h3.224l3.045-3.045h4.657l6.269-6.269V0H2.149zm19.164 13.612l-3.582 3.582H12l-3.045 3.045v-3.045H4.119V2.149h17.194v11.463zm-3.582-7.343v6.262h-2.149V6.269h2.149zm-5.731 0v6.262H9.851V6.269H12z' clipRule='evenodd' /></svg>
                                      {match.primary_caster.name}
                                    </a>
                                    : <p className='mr-4 text-xs italic text-gray-600'>Looking for caster</p>
                                  }

                                  { match.start_time
                                    ? (
                                      <>
                                        {formatDateTime(match.start_time)}
                                      </>
                                    )
                                    : <span className='block align-right'>TBD</span>
                                  }
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

              <PageTitle className='flex justify-between mt-8'>
                {currentRoundName ? `${currentRoundName}` : `Week of ${moment().startOf('isoweek').add(roundOffset * 7, 'days').format('M/D')}`}
                <div className='flex items-center text-sm px-2'>
                 Hide Spoilers:&nbsp;<input type='checkbox' className='' checked={!guideOptions.showSpoilers} onChange={handleSpoilersChange} />
                </div>
                <div className='flex items-center'>
                  <button className='px-2 ml-4 text-sm border border-gray-700 focus:outline-none focus:ring-1 rounded-l-md rounded-r-md hover:border-gray-500 focus:ring-gray-400 focus:border-black' onClick={() => pageTvGuide(roundOffset - 1)}>{'◁'}</button>
                  <button className='px-2 ml-1 text-sm border border-gray-700 focus:outline-none focus:ring-1 rounded-l-md rounded-r-md hover:border-gray-500 focus:ring-gray-400 focus:border-black' onClick={() => pageTvGuide(0)}>{'Current Week'}</button>
                  <button className='px-2 ml-1 text-sm transform rotate-180 border border-gray-700 focus:outline-none focus:ring-1 rounded-l-md rounded-r-md hover:border-gray-500 focus:ring-gray-400 focus:border-black' onClick={() => pageTvGuide(roundOffset + 1)}>{'◁'}</button>
                </div>
              </PageTitle>
              <TvGuide schedule={schedule} roundOffset={roundOffset} loading={tvLoading} scheduleWarning={scheduleWarning} guideOptions={guideOptions} />
            </div>
          )
      }
    </Chrome>
  )
}

export default Home
