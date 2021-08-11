import React from 'react'
import Chrome from '../components/Chrome'
import { PageTitle, Link } from '../components/elements'

function Links () {
  return (
    <Chrome>
      <PageTitle>Links</PageTitle>

      <div className='mb-2'>
        <Link target='_blank' href='https://beegame.gg'>Beegame.gg</Link>
        <p>Community organized KQB events, resources, code of conduct, and more!</p>
      </div>

      <div className='mb-2'>
        <Link target='_blank' href='https://discord.gg/beegame'>Join the Discord</Link>
      </div>

      <div className='mb-2'>
        <p>Follow us on Social Media</p>
        <Link target='_blank' href='https://twitter.com/BeeGameLeague'>Twitter</Link> &nbsp;
        <Link target='_blank' href='https://www.youtube.com/channel/UCRmlkOcC8wF5fg__VHIgujg'>Youtube</Link> &nbsp;
        <Link target='_blank' href='http://twitch.tv/BeeGameLeague'>Twitch</Link> &nbsp;
      </div>

      <div className='mb-2'>
        <p>League Brackets, Tournaments, & Events</p>
        <Link target='_blank' href='https://beegame.challonge.com/'>Bee Game Challonge </Link>
      </div>

      <div className='mb-2'>
        <Link target='_blank' href='https://forms.gle/zbk8HUtPohnVLXni8'>Standards Board Issue Form</Link>
      </div>

      <div className='mb-2'>
        <Link target='_blank' href='mailto:beegame.gg@gmail.com'>Email</Link>
      </div>
    </Chrome>
  )
}

export default Links
