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
  const [inactiveCircuits, setInactiveCircuits] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${getApiUrl()}circuits/?format=json&limit=100`)
        .then(x => x.json())
        .catch(handleError)

      let allCircuits = sortBy(get(response, 'results', []), ['season.registration_end', 'name'])

      setActiveCircuits(allCircuits.filter(x => x.is_active))
      setInactiveCircuits(allCircuits.filter(x => !x.is_active))
      setLoading(false)
    }

    fetchData()
  }, [])

  // NOTE(shenanigans, 2021-12-24): Waiting for a response from Bees on if she wants non-BGL circuits shown.  This flag
  // can toggle that.  Unfortunately, it looks like (1) there is some bad data in their (empty circuits, etc.), and
  // (2) the page becomes super long and unwieldly if done that way.  Also, (3) the !!x.name hack is terrible.  Shoot me later.
  function CircuitListing({ circuits, typeOfCircuits, showNonBglCircuits = false }) {
    return (
        <div>
          <PageTitle>{typeOfCircuits}</PageTitle>
          { circuits.length === 0 ? "There are currently no " + typeOfCircuits.toLowerCase() + ".  Please check back later." : (
              circuits.filter(x => showNonBglCircuits || !!x.name).map(x => (
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
          : <div>
            <CircuitListing circuits={activeCircuits} typeOfCircuits={"Active Circuits"} />
            <br /><br />
            <CircuitListing circuits={inactiveCircuits} typeOfCircuits={"Past Circuits"} />
          </div>
      }
    </Chrome>
  )
}

export default Circuits
