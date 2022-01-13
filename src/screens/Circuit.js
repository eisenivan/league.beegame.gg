import React, { useState, useEffect } from 'react'
import sortBy from 'lodash.orderby'
import Chrome from '../components/Chrome'
import Loading from '../components/Loading'
import { formatDateTime } from '../modules/guess-local-tz'
import { PageTitle, H2, MatchBox } from '../components/elements'
import { useParams, Link } from 'react-router-dom'
import fetch from '../modules/fetch-with-headers'
import getApiUrl from '../modules/get-api-url'
import handleError from '../modules/handle-error'

function Standings ({ teams }) {
  const sorted = sortBy(teams, ['wins', 'losses', t => t.name.toLowerCase()], ['desc', 'asc', 'asc'])
  return (
    <div className='shadow-xl'>
      { sorted.map((x, i) => (
        <div className={`shadow-xl text-md mg:text-lg lg:text-xl text-white text-shadow px-2 flex items-center justify-between border-b-2 ${i % 2 ? 'bg-blue-3' : 'bg-blue-3'}`} key={`${x.name}-${x.wins}-${x.losses}`}>
          <div className='max-w-md uppercase truncate font-head'><Link className='text-white' to={`/teams/${x.id}`}>{`${i + 1}. ${x.name}`}</Link></div>
          <div className='w-16 text-right uppercase font-head'><strong className='inline-block text-3xl'>{x.wins}</strong> - <strong className='inline-block text-3xl'>{x.losses}</strong></div>
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

      const matchResponse = await fetch(`${getApiUrl()}matches/?circuit=${id}&round_is_current=true&limit=50`)
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
          ? <Loading />
          : (
            <div>
              <PageTitle>{circuit.name || circuit.verbose_name}</PageTitle>
              <div className='grid grid-cols-1 md:grid-cols-content md:gap-12'>
                <div>
                  <H2>Matches This Week</H2>
                  { matches.length == 0 ? <div>There are no matches this week.</div> :
                    matches.sort((a, b) => {
                    // if neither match has a start time do nothing
                    if (!a.start_time && !b.start_time) {
                      return 0
                    }

                    // if b has a time and a does not, flip order
                    if (!a.start_time && b.start_time) {
                      return 1
                    }

                    // if a has a time and b does not, confirm order
                    if (a.start_time && !b.start_time) {
                      return -1
                    }

                    // if a has a time and it's less than b confirm order
                    if (a.start_time < b.start_time) {
                      return -1
                    }

                    // if a is later than b, flip order
                    if (a.start_time > b.start_time) {
                      return 1
                    }

                    // we should never get to here, but just do nothing if we do
                    return 0
                  }).map((match) => (
                    <MatchBox key={`match-${match.id}`} match={match}>
                      { match.primary_caster
                        ? (
                          match.primary_caster.stream_link

                            ? <a target='_blank' rel='noreferrer' className='flex items-center mr-4 text-xs leading-loose text-purple-400' href={match.primary_caster.stream_link}>
                              <svg className='w-3 h-3 mr-1' fill='currentColor' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'> <defs /> <path fillRule='evenodd' d='M2.149 0L.537 4.119v16.836h5.731V24h3.224l3.045-3.045h4.657l6.269-6.269V0H2.149zm19.164 13.612l-3.582 3.582H12l-3.045 3.045v-3.045H4.119V2.149h17.194v11.463zm-3.582-7.343v6.262h-2.149V6.269h2.149zm-5.731 0v6.262H9.851V6.269H12z' clipRule='evenodd' /></svg>
                              {match.primary_caster.name}
                            </a>
                            : null

                        )
                        : <p className='mr-4 text-xs italic text-gray-600'>Looking for caster</p> }
                      { match.start_time
                        ? (
                          <>
                            {formatDateTime(match.start_time)}
                          </>
                        )
                        : <span className='block align-right'>TBD</span> }
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
