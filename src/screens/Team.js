import React, { useState, useEffect } from 'react'
import { not, empty, and, equals } from 'regent'
import get from 'lodash.get'
import Chrome from '../components/Chrome'
import { PageTitle, PageSubtitle } from '../components/elements'
import { TeamRoster } from '../components/SingleTeam'
import { useParams } from 'react-router-dom'
import fetch from '../modules/fetch-with-headers'

const HAS_DYNASTY = not(empty('@dynasty'))
const CAN_EDIT_TEAM = and(
  equals('@is_active', true),
  equals('@team.captain.id', '@user.id')
)

function Team () {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://kqb.buzz/api/teams/${id}/`) // eslint-disable-line
      const json = await response.json()

      setTeam(json)
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
              <PageTitle>{team.name}</PageTitle>
              { HAS_DYNASTY(team)
                ? <PageSubtitle>Dynasty: {get(team, 'dynasty.name')}</PageSubtitle>
                : null }
              <TeamRoster className='mt-4' vertical team={team} />
              <div />
            </div>
          )
      }
    </Chrome>
  )
}

export default Team
