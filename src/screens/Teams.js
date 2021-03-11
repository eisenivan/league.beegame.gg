import React, { useState, useEffect } from 'react'
import { not, empty } from 'regent'
import get from 'lodash.get'
import Chrome from '../components/Chrome'
import { PageTitle, PageSubtitle } from '../components/elements'
import { useParams, Link, useLocation, useHistory } from 'react-router-dom'
import fetch from '../modules/fetch-with-headers'
import handleError from '../modules/handle-error'

const HAS_DYNASTY = not(empty('@dynasty'))

function useQuery () {
  return new URLSearchParams(useLocation().search)
}

function Teams () {
  const params = useQuery()
  const page = parseInt(params.get('page') || 1, 10)
  const q = params.get('q')
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState({})
  const [query, setQuery] = useState('')
  const history = useHistory()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const response = await fetch(`https://api-staging.beegame.gg/api/teams/?page=${page || 1}&name=${q || ''}`)
        .catch(handleError)
      const json = await response.json()
        .catch(handleError)

      setTeams(json)
      setLoading(false)
    }

    fetchData()
  }, [id, page, q])

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
              <div className='flex items-center mb-8'>
                <form onSubmit={search}>
                  <input className='-mr-1 py-1 px-2 text-lg border-solid border-2 border-gray-300' type='text' placeholder='Search' value={query} onChange={(e) => setQuery(e.target.value)} />
                  <button className='py-1 px-2 text-lg border-solid border-2 border-l-0 border-gray-300' type='submit'>Search</button>
                </form>
              </div>
              {get(teams, 'results', []).map((team) => (
                <div key={`${team.name}-${team.circuit}`} className='mb-2'>
                  { HAS_DYNASTY(team)
                    ? <PageSubtitle>{get(team, 'dynasty.name')}</PageSubtitle>
                    : null }
                  <Link to={`/teams/${team.id}`}><PageTitle>{team.name}</PageTitle></Link>
                  <div />
                </div>
              ))}

              {teams.previous
                ? <Link className='mr-2' to={`/teams?page=${page - 1}`}>Previous Page</Link>
                : null }

              {teams.next
                ? <Link to={`/teams?page=${page + 1}`}>Next Page</Link>
                : null }

            </div>
          )
      }
    </Chrome>
  )
}

export default Teams
