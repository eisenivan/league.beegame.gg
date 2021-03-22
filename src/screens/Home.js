import React from 'react'
import ReactTwitchEmbedVideo from 'react-twitch-embed-video'
import Chrome from '../components/Chrome'
import { PageTitle } from '../components/elements'

function Home () {
  return (
    <Chrome>
      <PageTitle>Check out BeeGameLeague on Twitch</PageTitle>
      <ReactTwitchEmbedVideo channel='BeeGameLeague' />
    </Chrome>
  )
}

export default Home
