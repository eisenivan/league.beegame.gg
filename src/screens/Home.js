import moment from 'moment'
import React from 'react'
import ReactTwitchEmbedVideo from 'react-twitch-embed-video'
import styled from 'styled-components'
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

function TvGuide (data) {
  return (
    <div className='grid grid-cols-7'>
      <DayColumn>
        <div class>Today</div>
        <CalendarDark>
          <CalendarEvents>
            <EventItem>
              <EventDot />
              <EventTitle>10:30 am</EventTitle>
              <EventText>Monday briefing with the team</EventText>
            </EventItem>
            <EventItem>
              <EventDot />
              <EventTitle>12:00 pm</EventTitle>
              <EventText>Lunch for with the besties</EventText>
            </EventItem>
            <EventItem>
              <EventDot />
              <EventTitle>13:00 pm</EventTitle>
              <EventText>Meet with the client for final design</EventText>
            </EventItem>
            <EventItem>
              <EventDot />
              <EventTitle>14:30 am</EventTitle>
              <EventText>Plan event night to inspire students</EventText>
            </EventItem>
            <EventItem>
              <EventDot />
              <EventTitle>15:30 am</EventTitle>
              <EventText>Add some more events to the calendar</EventText>
            </EventItem>
          </CalendarEvents>
        </CalendarDark>
      </DayColumn>
      <DayColumn>
        <div>Tomorrow</div>
      </DayColumn>
      <DayColumn>
        <div>{moment().add(3, 'days').format('dddd m/d')}</div>
      </DayColumn>
      <DayColumn>
        <div>{moment().add(4, 'days').format('dddd m/d')}</div>
      </DayColumn>
      <DayColumn>
        <div>{moment().add(5, 'days').format('dddd m/d')}</div>
      </DayColumn>
      <DayColumn>
        <div>{moment().add(6, 'days').format('dddd m/d')}</div>
      </DayColumn>
      <DayColumn>
        <div>{moment().add(7, 'days').format('dddd m/d')}</div>
      </DayColumn>
    </div>
  )
}

function Home () {
  return (
    <Chrome>
      <PageTitle>Check out BeeGameLeague on Twitch</PageTitle>
      <ReactTwitchEmbedVideo channel='BeeGameLeague' />

      <TvGuide />
    </Chrome>
  )
}

export default Home
