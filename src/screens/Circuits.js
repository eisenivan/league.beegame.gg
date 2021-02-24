import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Chrome from '../components/Chrome'

function Circuits () {
  const [loading, setLoading] = useState(true)
  const [leagues, setLeagues] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://kqb.buzz/api/leagues/?format=json') // eslint-disable-line
      const json = await response.json()
      const activeBglUrl = json
        .find(x => x.id === 4)
        .seasons
        .pop()

      const circuits = await fetch(activeBglUrl) // eslint-disable-line
      const circuitsJson = await circuits.json()

      const circuitsPromises = circuitsJson.circuits.map((x) => fetch(x)) // eslint-disable-line
      Promise.all(circuitsPromises).then((data) => {
        console.log(data, circuitsJson)
        setLeagues(circuitsJson.circuits)
        setLoading(false)
      })
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
              { leagues.map(x => (<Link key={`${x}`} className='block' to={`/circuits/${x.id}`}>{x.name}</Link>)) }
            </div>
          )
      }
    </Chrome>
  )
}

export default Circuits
