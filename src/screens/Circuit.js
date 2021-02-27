import React, { useState, useEffect } from 'react'
import sortBy from 'lodash.sortby'
import Chrome from '../components/Chrome'
import SingleTeam from '../components/SingleTeam'
import MatchList from '../components/MatchList'
import { PageTitle, H2 } from '../components/elements'
import { useParams } from 'react-router-dom'
import fetch from '../modules/fetch-with-headers'

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
  const [matches, setMatches] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://kqb.buzz/api/leagues/4/seasons/6/circuits/${id}/?format=json`) // eslint-disable-line
      const json = await response.json()

      const matchResponse = await fetch(`https://kqb.buzz/api/matches/?away=&circuit=${id}&days=&dynasties=&dynasty=&format=json&home=&hours=&league=&loser=&minutes=&primary_caster=&region=&round=&scheduled=true&season=&starts_in_minutes=&status=&team=&teams=&tier=&winner=`) // eslint-disable-line
      const matchJson = await matchResponse.json()

      setCircuit(json)
      setMatches(matchJson)
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
                  <MatchList matches={matches.results} />

                  <hr className='my-8' />

                  <H2 className='text-2xl'>Teams</H2>
                  { circuit.teams.map((team) => (
                    <SingleTeam key={`${team.name}-${circuit.name}-${id}`} team={team} />
                  ))}
                </div>
                <div>
                  <H2 className='text-2xl'>Standings</H2>
                  <Standings teams={circuit.teams} />
                </div>
              </div>

            </div>
          )
      }
    </Chrome>
  )
}

export default Circuit
