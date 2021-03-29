import React, { useState, useEffect } from 'react'
import moment from 'moment'
import get from 'lodash.get'
import ReactTwitchEmbedVideo from 'react-twitch-embed-video'
import styled from 'styled-components'
import fetch from '../modules/fetch-with-headers'
import { formatTime } from '../modules/guess-local-tz'
import getApiUrl from '../modules/get-api-url'
import Chrome from '../components/Chrome'
import { PageTitle } from '../components/elements'

const DayColumn = styled.div`

`

const CalendarDark = styled.div`
  box-shadow: 0px 0px 35px -16px rgba(0, 0, 0, 0.75);
  font-family: "Roboto", sans-serif;
  color: #363b41;
  display: inline-block;
  background-image: linear-gradient(-222deg, #646464, #454545);
  color: #fff;
`

const CalendarEvents = styled.div`
  color: #A39D9E;
`

const EventItem = styled.div`
  padding: 5px;
`

const EventTitle = styled.div`
  display: inline-block;
  font-size: 12px;
`

const EventText = styled.div`
  font-size: 12px;
`

function SingleEvent ({ event }) {
  return (
    <EventItem key={`${event.home.name}-${event.away.name}-${event.start_time}`}>
      <EventTitle>{formatTime(event.start_time)}</EventTitle>
      <EventText>{`${event.home.name} vs. ${event.away.name}`}</EventText>
      { event.primary_caster
        ? <a target='_blank' rel='noreferrer' className='text-xs' href={event.primary_caster.stream_link}>{event.primary_caster.name}</a>
        : <span className='text-xs'>Looking for caster</span> }

    </EventItem>
  )
}

function TvGuide ({ schedule }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7'>
      <DayColumn>
        <div>Today</div>
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
        <div>Tomorrow</div>
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
        <div>{moment().add(2, 'days').format('M/D')}</div>
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
        <div>{moment().add(3, 'days').format('M/D')}</div>
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
        <div>{moment().add(4, 'days').format('M/D')}</div>
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
        <div>{moment().add(5, 'days').format('M/D')}</div>
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
        <div>{moment().add(6, 'days').format('M/D')}</div>
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
  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${getApiUrl()}matches/?scheduled=true`)
        .then(data => data.json())
        .then(data => () => sortEventsIntoDates(data.results))
        .then(data => setSchedule(data))

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
                  coming soon

                  <PageTitle className='mt-8'>Your Upcomming Matches</PageTitle>
                  coming soon
                </div>
              </div>

              <PageTitle className='mt-8'>Upcomming Matches</PageTitle>
              <TvGuide schedule={schedule} />
            </div>

          )
      }
    </Chrome>
  )
}

export default Home
