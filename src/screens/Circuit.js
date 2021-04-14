import React, { useState, useEffect } from 'react'
import sortBy from 'lodash.sortby'
import Chrome from '../components/Chrome'
import { formatDateTime } from '../modules/guess-local-tz'
import { PageTitle, H2, MatchBox } from '../components/elements'
import { useParams, Link } from 'react-router-dom'
import fetch from '../modules/fetch-with-headers'
import getApiUrl from '../modules/get-api-url'
import handleError from '../modules/handle-error'

function Standings ({ teams }) {
  const sorted = sortBy(teams, ['wins', o => o.losses * -1]).reverse()
  return (
    <div className='shadow-xl'>
      { sorted.map((x, i) => (
        <div className={`shadow-xl font-head text-xl font-bold text-white text-shadow px-2 flex items-center justify-between ${i % 2 ? 'bg-blue-2' : 'bg-yellow-2'}`} key={`${x.name}-${x.wins}-${x.losses}`}>
          <div className='max-w-md font-head uppercase truncate'><Link className='text-white' to={`/teams/${x.id}`}>{`${i + 1}. ${x.name}`}</Link></div>
          <div className='w-16 font-head uppercase text-right'><strong className='inline-block text-3xl'>{x.wins}</strong> - <strong className='inline-block text-3xl'>{x.losses}</strong></div>
        </div>
      )) }
    </div>
  )
}

function Circuit () {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [circuit, setCircuit] = useState({})
  const [teams, setTeams] = useState({})
  const [matches, setMatches] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${getApiUrl()}circuits/${id}/?format=json`)
        .catch(handleError)
      const json = await response.json()
        .catch(handleError)

      const teamResponse = await fetch(`${getApiUrl()}teams/?circuit=${id}&limit=50`)
        .catch(handleError)
      const teamJson = await teamResponse.json()
        .catch(handleError)

      const matchResponse = await fetch(`${getApiUrl()}matches/?circuit=${id}&scheduled=true`)
        .catch(handleError)
      const matchJson = await matchResponse.json()
        .catch(handleError)

      setCircuit(json)
      setTeams(teamJson.results)
      setMatches(matchJson.results)
      setLoading(false)
    }

    fetchData()
  }, [id])

  return (
    <Chrome>
      {
        loading
          ? <div>loading...</div>
          : (
            <div>
              <PageTitle>{circuit.name}</PageTitle>
              <div className='grid grid-cols-1 md:grid-cols-content md:gap-12'>
                <div>
                  <H2>Matches This Week</H2>
                  { matches.map((match) => (
                    <MatchBox key={`match-${match.id}`} match={match}>
                      { match.primary_caster
                        ? (
                          match.primary_caster.stream_link
                            ? <a className='mr-2' target='_blank' rel='noreferrer' href={match.primary_caster.stream_link}>{match.primary_caster.name}</a>
                            : <span>{match.primary_caster.name}</span>
                        )
                        : null }
                      {formatDateTime(match.start_time)}
                    </MatchBox>
                  )) }
                </div>
                <div>
                  <H2>Standings</H2>
                  <Standings teams={teams} />
                </div>
              </div>

            </div>
          )
      }
    </Chrome>
  )
}

export default Circuit
