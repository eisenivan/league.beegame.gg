import React, { useState, useEffect } from 'react'
import { not, empty } from 'regent'
import get from 'lodash.get'
import Chrome from '../components/Chrome'
import { PageTitle, PageSubtitle, utilityButtonString } from '../components/elements'
import { useParams, Link, useLocation, useHistory } from 'react-router-dom'
import fetch from '../modules/fetch-with-headers'
import getApiUrl from '../modules/get-api-url'
import handleError from '../modules/handle-error'

const HAS_DYNASTY = not(empty('@dynasty'))

function useQuery () {
  return new URLSearchParams(useLocation().search)
}

function Teams () {
  const params = useQuery()
  const offset = parseInt(params.get('offset') || 0, 10)
  const q = params.get('q')
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState({})
  const [query, setQuery] = useState('')
  const history = useHistory()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const response = await fetch(`${getApiUrl()}teams/?offset=${offset || 0}&name=${q || ''}`)
        .then(data => data.json())
        .catch(handleError)

      setTeams(response)
      setLoading(false)
    }

    fetchData()
  }, [id, offset, q])

  function updateQProp (e) {
    history.push({
      pathname: '/teams',
      search: `?q=${query}`
    })
  }

  function search (e) {
    e.preventDefault()
    e.stopPropagation()
    updateQProp(e)
  }

  return (
    <Chrome>
      {
        loading
          ? <div>loading...</div>
          : (
            <div>
              <PageTitle>Find a BGL Team</PageTitle>
              <div className='flex items-center mb-8'>
                <form onSubmit={search}>
                  <input className='-mr-1 py-1 px-2 text-lg text-gray-3 border-solid border-2 border-gray-300' type='text' placeholder='Search' value={query} onChange={(e) => setQuery(e.target.value)} />
                  <button className='py-1 px-2 text-lg border-solid border-2 border-l-0 border-gray-300' type='submit'>Search</button>
                </form>
              </div>
              {get(teams, 'results', []).map((team) => (
                <div key={`${team.name}-${team.circuit}`} className='mb-2'>
                  { HAS_DYNASTY(team)
                    ? <PageSubtitle style={{ marginTop: '0rem', marginBottom: '-0.25rem' }}>{get(team, 'dynasty.name')}</PageSubtitle>
                    : null }
                  <Link to={`/teams/${team.id}`}><span>{team.name}</span></Link>
                  <div />
                </div>
              ))}

              {teams.previous
                ? <Link className={`${utilityButtonString} mr-2`} to={`/teams/?offset=${(offset - 10)}`}>Previous Page</Link>
                : null }

              {teams.next
                ? <Link className={utilityButtonString} to={`/teams/?offset=${(offset + 10)}`}>Next Page</Link>
                : null }

            </div>
          )
      }
    </Chrome>
  )
}

export default Teams
