import React, { useState, useEffect } from 'react'
import Chrome from '../components/Chrome'
import { PageTitle } from '../components/elements'
import { Link } from 'react-router-dom'
import fetch from '../modules/fetch-with-headers'
import getApiUrl from '../modules/get-api-url'
import handleError from '../modules/handle-error'

function Teams () {
  const [loading, setLoading] = useState(true)
  const [casters, setCasters] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      fetch(`${getApiUrl()}casters/?is_active=true&limit=100`)
        .then(data => data.json())
        .then(data => setCasters(data.results.sort()))
        .catch(handleError)

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
            <>
              <div>
                <PageTitle>Casters</PageTitle>
                {casters.map((caster) => (
                  <div>
                    <Link to={`/casters/${caster.id}/`}>{caster.name}</Link>
                  </div>
                ))}
              </div>
              {casters.length === 0
                ? <span className='text-normal mb-2'>Casters coming soon...</span>
                : null }
            </>
          )
      }
      <div className='mt-5 text-sm'>Apply to be a caster <a rel='noreferrer' href='https://forms.gle/qVy83m72xVQRtgsDA' target='_blank'>here</a>.</div>
    </Chrome>
  )
}

export default Teams
