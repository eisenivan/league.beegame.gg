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
import handleError from '../modules/handle-error'
import { PageTitle, MatchBox, linkString } from '../components/elements'
import SingleTeam from '../components/SingleTeam'

const DayColumn = styled.div`

`

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

function SingleEvent ({ event }) {
  return (
    <EventItem key={`${event.home.name}-${event.away.name}-${event.start_time}`}>
      <p className='pl-1 mb-1 text-xs text-yellow-1'>{formatTime(event.start_time)}</p>
      <div class='inline-block rounded px-2 py-1 bg-gray-2 text-gray-400 w-full md:w-auto mb-1'>

        { event.circuit
          ? <p className='mt-1 text-gray-500 uppercase text-2xs'><Link className='text-gray-500' to={`/circuits/${event.circuit.id}/`}>{event.circuit.name} Circuit</Link></p>
          : null }

          <p className='inline-block px-1 py-1 -ml-1 text-xs font-bold text-white'>{`${event.home.name} vs. ${event.away.name}`}</p>


        { event.primary_caster
          ? <a target='_blank' rel='noreferrer' className='flex items-center text-xs leading-loose text-purple-400' href={event.primary_caster.stream_link}><svg class='mr-1 w-3 h-3' fill='currentColor' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'> <defs /> <path fill-rule='evenodd' d='M2.149 0L.537 4.119v16.836h5.731V24h3.224l3.045-3.045h4.657l6.269-6.269V0H2.149zm19.164 13.612l-3.582 3.582H12l-3.045 3.045v-3.045H4.119V2.149h17.194v11.463zm-3.582-7.343v6.262h-2.149V6.269h2.149zm-5.731 0v6.262H9.851V6.269H12z' clip-rule='evenodd' /></svg>{event.primary_caster.name}</a>
          : <p className='text-xs italic'>Looking for caster</p> }
      </div>
    </EventItem>
  )
}

function TvGuide ({ schedule }) {
  return (
    <div style={{ backgroundImage: 'repeating-linear-gradient(45deg, #202020, #202020 30px, #222 30px, #222 60px)' }} className='grid grid-cols-1 shadow-lg md:grid-cols-2 lg:grid-cols-7 md:rounded-t-md'>
      <DayColumn>
        <div className='p-1 font-bold text-center border-b border-gray-800 md:p-2 md:rounded-tl-md bg-blue-3 md:border-none'>
          <div className='text-xs uppercase text-blue-4'>{moment().format('ddd')}</div>
          <div>Today</div>
        </div>
        <CalendarDark>
          <CalendarEvents>
            { get(schedule, `[${moment().format('YYYYMMDD')}]`, []).map((event) => {
              return (
                <SingleEvent key={`${event.home.name}-${event.away.name}-${event.start_time}`} event={event} />
              )
            })}
          </CalendarEvents>
        </CalendarDark>
      </DayColumn>
      <DayColumn>
        <div className='p-1 font-bold text-center border-b border-gray-800 md:p-2 bg-blue-3 md:border-none'>
        <div className='text-xs uppercase text-blue-4'>{moment().add(1, 'days').format('ddd')}</div>
          <div>Tomorrow</div>
        </div>
        <CalendarDark>
          <CalendarEvents>
            { get(schedule, `[${moment().add(1, 'days').format('YYYYMMDD')}]`, []).map((event) => {
              return (
                <SingleEvent key={`${event.home.name}-${event.away.name}-${event.start_time}`} event={event} />
              )
            })}
          </CalendarEvents>
        </CalendarDark>
      </DayColumn>
      <DayColumn>
        <div className='p-1 font-bold text-center border-b border-gray-800 md:p-2 bg-blue-3 md:border-none'>
          <div className='text-xs uppercase text-blue-4'>{moment().add(2, 'days').format('ddd')}</div>
          <div>{moment().add(2, 'days').format('M/D')}</div>
        </div>
        <CalendarDark>
          <CalendarEvents>
            { get(schedule, `[${moment().add(2, 'days').format('YYYYMMDD')}]`, []).map((event) => {
              return (
                <SingleEvent key={`${event.home.name}-${event.away.name}-${event.start_time}`} event={event} />
              )
            })}
          </CalendarEvents>
        </CalendarDark>
      </DayColumn>
      <DayColumn>
        <div className='p-1 font-bold text-center border-b border-gray-800 md:p-2 bg-blue-3 md:border-none'>
          <div className='text-xs uppercase text-blue-4'>{moment().add(3, 'days').format('ddd')}</div>
          <div>{moment().add(3, 'days').format('M/D')}</div>
        </div>
        <CalendarDark>
          <CalendarEvents>
            { get(schedule, `[${moment().add(3, 'days').format('YYYYMMDD')}]`, []).map((event) => {
              return (
                <SingleEvent key={`${event.home.name}-${event.away.name}-${event.start_time}`} event={event} />
              )
            })}
          </CalendarEvents>
        </CalendarDark>
      </DayColumn>
      <DayColumn>
        <div className='p-1 font-bold text-center border-b border-gray-800 md:p-2 bg-blue-3 md:border-none'>
          <div className='text-xs uppercase text-blue-4'>{moment().add(4, 'days').format('ddd')}</div>
          <div>{moment().add(4, 'days').format('M/D')}</div>
        </div>
        <CalendarDark>
          <CalendarEvents>
            { get(schedule, `[${moment().add(4, 'days').format('YYYYMMDD')}]`, []).map((event) => {
              return (
                <SingleEvent key={`${event.home.name}-${event.away.name}-${event.start_time}`} event={event} />
              )
            })}
          </CalendarEvents>
        </CalendarDark>
      </DayColumn>
      <DayColumn>
        <div className='p-1 font-bold text-center border-b border-gray-800 md:p-2 bg-blue-3 md:border-none'>
          <div className='text-xs uppercase text-blue-4'>{moment().add(5, 'days').format('ddd')}</div>
          <div>{moment().add(5, 'days').format('M/D')}</div>
        </div>
        <CalendarDark>
          <CalendarEvents>
            { get(schedule, `[${moment().add(5, 'days').format('YYYYMMDD')}]`, []).map((event) => {
              return (
                <SingleEvent key={`${event.home.name}-${event.away.name}-${event.start_time}`} event={event} />
              )
            })}
          </CalendarEvents>
        </CalendarDark>
      </DayColumn>
      <DayColumn>
        <div className='p-1 font-bold text-center border-b border-gray-800 md:p-2 md:rounded-tr-md bg-blue-3 md:border-none'>
          <div className='text-xs uppercase text-blue-4'>{moment().add(6, 'days').format('ddd')}</div>
          <div>{moment().add(6, 'days').format('M/D')}</div>
        </div>
        <CalendarDark>
          <CalendarEvents>
            { get(schedule, `[${moment().add(6, 'days').format('YYYYMMDD')}]`, []).map((event) => {
              return (
                <SingleEvent key={`${event.home.name}-${event.away.name}-${event.start_time}`} event={event} />
              )
            })}
          </CalendarEvents>
        </CalendarDark>
      </DayColumn>
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
  const [schedule, setSchedule] = useState({})
  const [profile, setProfile] = useState({})
  const [playerMatches, setPlayerMatches] = useState({})
  let userId = cookie.load('userId')
  useEffect(() => {
    const fetchData = async () => {
      const promises = []
      promises.push(fetch(`${getApiUrl()}matches/?days=7&scheduled=true&limit=100`)
        .then(data => data.json())
        .then(data => () => sortEventsIntoDates(data.results))
        .then(data => setSchedule(data))
        .catch(handleError))

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

  const token = cookie.load('token', true)
  return (
    <Chrome>
      {
        loading
          ? <div>loading...</div>
          : (
            <div>
              <div className='grid grid-cols-1 mb-8 sm:mt-8 md:mt-0 md:grid-cols-content'>
                <div className='max-w-lg mb-5 overflow-hidden md:mb-0'>
                  <PageTitle>Check out BeeGameLeague on Twitch</PageTitle>
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

              <PageTitle className='mt-8'>Upcoming Matches</PageTitle>
              <TvGuide schedule={schedule} />
            </div>

          )
      }
    </Chrome>
  )
}

export default Home
