import React, { useState, useEffect } from 'react'
import { not, empty } from 'regent'
import get from 'lodash.get'
import Chrome from '../components/Chrome'
import { PageTitle, PageSubtitle } from '../components/elements'
import { TeamRoster } from '../components/SingleTeam'
import { useParams } from 'react-router-dom'
import fetch from '../modules/fetch-with-headers'
import handleError from '../modules/handle-error'

const HAS_DYNASTY = not(empty('@dynasty'))

function Team () {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState({})
  const [editTeam, setEditTeam] = useState(false)
  const [name, setName] = useState()

  function toggleEditTeam () {
    setEditTeam(!editTeam)
  }

  function onTitleChange (e) {
    return setName(e.target.value)
  }

  async function handleSubmit (e) {
    e.preventDefault()

    const data = { name }
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }

    fetch(`https://api-staging.beegame.gg/api/teams/${id}/`, requestOptions)
      .then(res => res.json())
      .then((res) => {
        setName(res.name)
        toggleEditTeam()
      })
      .catch(handleError)
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://api-staging.beegame.gg/api/teams/${id}/`)
        .catch(handleError)
      const json = await response.json()
        .catch(handleError)

      setTeam(json)
      setName(json.name)
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
              { editTeam
                ? (
                  <div className=''>
                    <input
                      className='shadow inline-block appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      placeholder='Team Name'
                      name='name'
                      value={name}
                      onChange={onTitleChange}
                      required />

                    <button
                      className='float bg-yellow-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                      type='submit'
                      onClick={handleSubmit}>
                      Update
                    </button>

                    <button
                      className='float bg-gray-1 hover:bg-blue-700 text-gray-3 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                      type='submit'
                      onClick={toggleEditTeam}>
                      Cancel
                    </button>
                  </div>
                )
                : (
                <>
                  <PageTitle>{name}</PageTitle>
                  { team.can_add_members
                    ? <button onClick={toggleEditTeam} className='ml-2' to={`/teams/${id}/edit`}>✏️</button>
                    : null }
                  </>
                ) }

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
