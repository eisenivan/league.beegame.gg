import React, { useState, useEffect } from 'react'
import moment from 'moment'
import get from 'lodash.get'
import ReactTwitchEmbedVideo from 'react-twitch-embed-video'
import styled from 'styled-components'
import fetch from '../modules/fetch-with-headers'
import { formatTime } from '../modules/guess-local-tz'
import getApiUrl from '../modules/get-api-url'
import Chrome from '../components/Chrome'
import handleError from '../modules/handle-error'
import { PageTitle } from '../components/elements'
import SingleTeam from '../components/SingleTeam'

const DayColumn = styled.div`

`

const CalendarDark = styled.div`
  box-shadow: 0px 0px 35px -16px rgba(0, 0, 0, 0.75);
  font-family: "Roboto", sans-serif;
  color: #363b41;
  background-image: linear-gradient(-222deg, #222, #111);
  color: #fff;
`

const CalendarEvents = styled.div`
  color: #A39D9E;
`

const EventItem = styled.div`
  padding: 5px;
`

function SingleEvent ({ event }) {
  return (
    <EventItem key={`${event.home.name}-${event.away.name}-${event.start_time}`}>
      <p className='italic text-xs'>{formatTime(event.start_time)}</p>
      <p className='font-bold text-xs'>{`${event.home.name} vs. ${event.away.name}`}</p>
      { event.primary_caster
        ? <a target='_blank' rel='noreferrer' className='text-xs' href={event.primary_caster.stream_link}>{event.primary_caster.name}</a>
        : <span className='text-xs italic'>Looking for caster</span> }

    </EventItem>
  )
}

function TvGuide ({ schedule }) {
  return (
    <div style={{ backgroundImage: 'repeating-linear-gradient(45deg, #202020, #202020 30px, #222 30px, #222 60px)' }} className='shadow-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7'>
      <DayColumn>
        <div className='bg-blue-3 font-bold text-center p-2'>Today</div>
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
        <div className='bg-blue-3 font-bold text-center p-2'>Tomorrow</div>
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
        <div className='bg-blue-3 font-bold text-center p-2'>{moment().add(2, 'days').format('M/D')}</div>
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
        <div className='bg-blue-3 font-bold text-center p-2'>{moment().add(3, 'days').format('M/D')}</div>
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
        <div className='bg-blue-3 font-bold text-center p-2'>{moment().add(4, 'days').format('M/D')}</div>
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
        <div className='bg-blue-3 font-bold text-center p-2'>{moment().add(5, 'days').format('M/D')}</div>
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
        <div className='bg-blue-3 font-bold text-center p-2'>{moment().add(6, 'days').format('M/D')}</div>
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
  const [schedule, setSchedule] = useState([])
  const [profile, setProfile] = useState({})
  useEffect(() => {
    const fetchData = async () => {
      const promises = []
      promises.push(fetch(`${getApiUrl()}matches/?scheduled=true`)
        .then(data => data.json())
        .then(data => () => sortEventsIntoDates(data.results))
        .then(data => setSchedule(data))
        .catch(handleError))

      promises.push(fetch(`${getApiUrl()}me/?format=json`)
        .then(data => data.json())
        .then(data => setProfile(data))
        .catch(handleError))

      await Promise.all(promises)
      setLoading(false)
    }

    fetchData()
  }, [])
  return (
    <Chrome>
      {
        loading
          ? <div>loading...</div>
          : (
            <div>
              <div className='mb-8 sm:mt-8 md:mt-0 grid grid-cols-1 md:grid-cols-content'>
                <div>
                  <PageTitle>Check out BeeGameLeague on Twitch</PageTitle>
                  <ReactTwitchEmbedVideo height='300' layout='video' channel='BeeGameLeague' />
                </div>
                <div>
                  <PageTitle>Your Teams</PageTitle>
                  { get(profile, 'player.teams')
                    ? (
                        <>
                          { profile.player.teams.map(x => (
                            <div key={`${x.id}-${x.name}`} className='my-2'>
                              <SingleTeam className='text-md' team={x} />
                            </div>
                          ))}
                        </>
                    ) : null}

                  <PageTitle className='mt-8'>Your Upcoming Matches</PageTitle>
                  coming soon
                </div>
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
