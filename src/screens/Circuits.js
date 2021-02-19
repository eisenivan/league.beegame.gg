import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Chrome from '../components/Chrome'

function Home () {
  const [loading, setLoading] = useState(true)
  const [leagues, setLeagues] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('https://kqb.buzz/api/leagues/?format=json', {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })

      console.log(response.data)
      setLeagues(response.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <Chrome>
      {
        loading && leagues.length > 0
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
