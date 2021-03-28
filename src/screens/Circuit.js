import React, { useState, useEffect } from 'react'
import sortBy from 'lodash.sortby'
import Chrome from '../components/Chrome'
import SingleTeam from '../components/SingleTeam'
import MatchList from '../components/MatchList'
import { PageTitle, H2, LightContentBox } from '../components/elements'
import { useParams } from 'react-router-dom'
import fetch from '../modules/fetch-with-headers'
import getApiUrl from '../modules/get-api-url'
import handleError from '../modules/handle-error'

function Standings ({ teams }) {
  const sorted = sortBy(teams, 'wins').reverse()
  return (
    <>
      { sorted.map(x => (
        <div key={`${x.name}-${x.wins}-${x.losses}`}>
          <div>{x.name}</div>
          <div>{x.wins} - {x.losses}</div>
        </div>
      )) }
    </>
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
                  <H2 className='text-2xl'>Schedule</H2>
                  <MatchList matches={matches} />

                  <hr className='my-8' />

                  <H2 className='text-2xl'>Teams</H2>
                  <LightContentBox>
                    { teams.map((team) => (
                      <SingleTeam key={`${team.name}-${circuit.name}-${team.id}`} team={team} />
                    ))}
                  </LightContentBox>
                </div>
                <div>
                  <H2 className='text-2xl'>Standings</H2>
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
