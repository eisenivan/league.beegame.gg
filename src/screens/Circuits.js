import React, { useState, useEffect } from 'react'
import Chrome from '../components/Chrome'

function Home () {
  const [loading, setLoading] = useState(true)
  const [leagues, setLeagues] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://kqb.buzz/api/leagues/?format=json') // eslint-disable-line
      const json = await response.json()
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
              { leagues.map(x => (<span>{x.name}</span>)) }
            </div>
          )
      }
    </Chrome>
  )
}

export default Home
