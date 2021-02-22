import React, { useState, useEffect } from 'react'
import Chrome from '../components/Chrome'
import SingleTeam from '../components/SingleTeam'
import MatchList from '../components/MatchList'
import { PageTitle, H2 } from '../components/elements'
import { useParams } from 'react-router-dom'

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

      console.log(json)
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
              <div className='grid grid-cols-1 md:grid-cols-2'>
                <div>
                  <H2 className='text-2xl'>Schedule</H2>
                  <MatchList matches={matches.results} />
                </div>
                <div>
                  <H2 className='text-2xl'>Teams</H2>
                  <em>wold love to have team record here. We can query each team to get their record, but it would be great to not have to.</em>
                  { circuit.teams.map((team) => (
                    <SingleTeam key={`${team}-${circuit.name}-${id}`} team={team} />
                  ))}
                </div>
              </div>

            </div>
          )
      }
    </Chrome>
  )
}

export default Circuit
