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
        <p>Bronze Season East</p>
        <Link target='_blank' href='https://beegame.challonge.com/bronze_t1_east'>Tier 1 East</Link> &nbsp;
        <Link target='_blank' href='https://beegame.challonge.com/bronze_t2_east'>Tier 2 East</Link> &nbsp;
        <Link target='_blank' href='https://beegame.challonge.com/bronze_t3_east'>Tier 3 East</Link> &nbsp;
        <Link target='_blank' href='https://beegame.challonge.com/bronze_t4_east'>Tier 4 East</Link> &nbsp;
        <Link target='_blank' href='https://beegame.challonge.com/z9dz581c'>East Swiss Circuit Play</Link> &nbsp;
      </div>

      <div className='mb-2'>
        <p>Bronze Season West</p>
        <Link target='_blank' href='https://beegame.challonge.com/bronze_t1_west'>Tier 1 West</Link> &nbsp;
        <Link target='_blank' href='https://beegame.challonge.com/bronze_t2_west'>Tier 2 West</Link> &nbsp;
        <Link target='_blank' href='https://beegame.challonge.com/bronze_t3_west'>Tier 3 West</Link> &nbsp;
        <Link target='_blank' href='https://beegame.challonge.com/bronze_t4_west'>Tier 4 West</Link> &nbsp;
        <Link target='_blank' href='https://beegame.challonge.com/cf07wetc'>West Swiss Circuit Play</Link> &nbsp;
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
