import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Chrome from '../components/Chrome'
import fetch from '../modules/fetch-with-headers'
import handleError from '../modules/handle-error'

function Circuits () {
  const [loading, setLoading] = useState(true)
  const [leagues, setLeagues] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://api-staging.beegame.gg/leagues/?format=json') // eslint-disable-line
        .catch(handleError)
      const json = await response.json()
        .catch(handleError)

      setLeagues(json)
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
              { leagues.map(x => (<Link key={`${x.name}`} className='block' to={`/circuits/${x.id}`}>{x.name}</Link>)) }
            </div>
          )
      }
    </Chrome>
  )
}

export default Circuits
