import React, { useState, useEffect } from 'react'
import moment from 'moment'
import ReactTwitchEmbedVideo from 'react-twitch-embed-video'
import styled from 'styled-components'
import fetch from '../modules/fetch-with-headers'
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
`

const EventDot = styled.div`
  margin-right: 14px;
  display: inline-block;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  background-color: #A39D9E;
  box-shadow: 0px 0px 52px -18px rgba(0, 0, 0, 0.75);
`

const EventText = styled.div`
  font-size: 12px;
  margin-left: 27px;
`

function TvGuide (schedule) {
  console.log(schedule)
  return (
    <div className='grid grid-cols-7'>
      <DayColumn>
        <div>Today</div>
        <CalendarDark>
          <CalendarEvents>
            <EventItem>
              <EventDot />
              <EventTitle>10:30 am</EventTitle>
              <EventText>Gang vs. Peeps</EventText>
            </EventItem>
            <EventItem>
              <EventDot />
              <EventTitle>12:00 pm</EventTitle>
              <EventText>Snail Satan vs. The Fighting Dadcores</EventText>
            </EventItem>
            <EventItem>
              <EventDot />
              <EventTitle>3:00 pm</EventTitle>
              <EventText>Meet with the client for final design</EventText>
            </EventItem>
          </CalendarEvents>
        </CalendarDark>
      </DayColumn>
      <DayColumn>
        <div>Tomorrow</div>
      </DayColumn>
      <DayColumn>
        <div>{moment().add(2, 'days').format('M/D')}</div>
      </DayColumn>
      <DayColumn>
        <div>{moment().add(3, 'days').format('M/D')}</div>
      </DayColumn>
      <DayColumn>
        <div>{moment().add(4, 'days').format('M/D')}</div>
      </DayColumn>
      <DayColumn>
        <div>{moment().add(5, 'days').format('M/D')}</div>
      </DayColumn>
      <DayColumn>
        <div>{moment().add(6, 'days').format('M/D')}</div>
      </DayColumn>
    </div>
  )
}

function sortEventsIntoDates (events) {
  return events
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
            <>
              <PageTitle>Check out BeeGameLeague on Twitch</PageTitle>
              <ReactTwitchEmbedVideo height='300' layout='video' channel='BeeGameLeague' />

              <TvGuide schedule={schedule} />
            </>
          )
      }
    </Chrome>
  )
}

export default Home
