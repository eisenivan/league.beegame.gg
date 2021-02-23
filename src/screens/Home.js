import React from 'react'
import Chrome from '../components/Chrome'

function Home () {
  return (
    <Chrome>
      <p>Not really sure what's going to go on the homepage Any UX people with opinions?</p>
      <p>Rough TODO list</p>
      <ul className='mt-4 list-disc pl-4'>
        <li>Awards page</li>
        <li>Build out circuit dashboard</li>
        <li>Build out standings</li>
        <li>Display circuit data on /circuts when it is added</li>
        <li>Dynasty landing page</li>
        <li>Match details page</li>
        <li>Team dashboards</li>
        <li>TV Guide page</li>
      </ul>
    </Chrome>
  )
}

export default Home
