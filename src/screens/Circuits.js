import React, { useState, useEffect } from 'react'
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
              { leagues.map(x => (<a key={`${x}`} className='block' href={`/${x.match(/circuits\/[0-9]+/)}`}>{x}</a>)) }
            </div>
          )
      }
    </Chrome>
  )
}

export default Circuits
