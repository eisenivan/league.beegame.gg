import React, { useState, useEffect } from 'react'
import get from 'lodash.get'
import sortBy from 'lodash.sortby'
import { Link } from 'react-router-dom'
import Chrome from '../components/Chrome'
import Loading from '../components/Loading'
import fetch from '../modules/fetch-with-headers'
import getApiUrl from '../modules/get-api-url'
import handleError from '../modules/handle-error'
import { PageTitle, PageSubtitle } from '../components/elements'

function Circuits () {
  const [loading, setLoading] = useState(true)
  const [activeCircuits, setActiveCircuits] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${getApiUrl()}circuits/?is_active=true&format=json`)
        .then(x => x.json())
        .catch(handleError)

      setActiveCircuits(sortBy(get(response, 'results', []), 'name'))
      setLoading(false)
    }

    fetchData()
  }, [])

  function CircuitListing({ circuits, typeOfCircuits }) {
    return (
        <div>
          <PageTitle>{typeOfCircuits}</PageTitle>
          { circuits.length === 0 ? "There are currently no " + typeOfCircuits.toLowerCase() + ".  Please check back later." : (
              circuits.map(x => (
                  <span key={JSON.stringify(x)}>
                    <PageSubtitle style={{ marginTop: '0rem', marginBottom: '-0.25rem' }}>{x.season.name}</PageSubtitle>
                    <Link key={`${x.name}`} className='block text-lg mb-2' to={`/circuits/${x.id}/`}>{x.name ? x.name : x.verbose_name}</Link>
                    {get(x, 'groups.length', 0) > 0
                      ? (
                        sortBy(x.groups, 'name')
                          .map(group => (
                            <Link key={`${group.name}`} className='block text-sm mb-2 pl-4' to={`/circuits/${x.id}/${group.id}/`}>{group.name}</Link>
                          ))

                      )
                      : null }
                    <div className='mb-4' />
                  </span>
              )))}
        </div>
    )
  }

  return (
    <Chrome>
      {
        loading
          ? <Loading />
          : <CircuitListing circuits={activeCircuits} typeOfCircuits={"Active Circuits"} />
      }
    </Chrome>
  )
}

export default Circuits
