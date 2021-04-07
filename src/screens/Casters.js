import React, { useState, useEffect } from 'react'
import Chrome from '../components/Chrome'
import { PageTitle } from '../components/elements'
import { Link } from 'react-router-dom'
import getApiUrl from '../modules/get-api-url'
import handleError from '../modules/handle-error'

function Teams () {
  const [loading, setLoading] = useState(true)
  const [casters, setCasters] = useState([])

  useEffect(() => {
    const fetchData = async () => {      
      setLoading(true)
      const response = await fetch(`${getApiUrl()}casters/`)
        .then(data => data.json())
        .catch(handleError)

      setCasters(response.results)
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
              <PageTitle>Caster</PageTitle>
              {casters.map((caster) => (
                <Link className='block' to={`/casters/${caster.id}/`}>{caster.name}</Link>
              ))}
            </div>
          )
      }
    </Chrome>
  )
}

export default Teams
