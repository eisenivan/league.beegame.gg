import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Chrome from '../components/Chrome'
import Loading from '../components/Loading'
import fetch from '../modules/fetch-with-headers'
import getApiUrl from '../modules/get-api-url'
import handleError from '../modules/handle-error'
import { Input, Select, Button, FormBox, Error, PageTitle, CenterContent } from '../components/elements'

function RegisterTeam () {
  const [loading, setLoading] = useState(true)
  const [circuits, setCircuits] = useState([])
  const [circuit, setCircuit] = useState()
  const [name, setName] = useState('')
  const [error, setError] = useState()
  const history = useHistory()

  useEffect(() => {
    const fetchData = async () => {
      const circuits = await fetch(`${getApiUrl()}circuits/?format=json&registration_open=true`)
        .then(x => x.json())
        .catch(handleError)

      setCircuits(circuits.results)

      setLoading(false)
    }

    fetchData()
  }, [])

  async function handleSubmit (e) {
    e.preventDefault()

    const data = { name, circuit }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }

    fetch(`${getApiUrl()}teams/`, requestOptions)
      .then(res => res.json())
      .then(res => {
        if (res.id) {
          history.push({
            pathname: `/teams/${res.id}/`
          })
        } else {
          setError(res)
        }
      })
      .catch(handleError)
  }

  return (
    <Chrome>
      {
        loading
          ? <Loading />
          : (
            <CenterContent>
              <PageTitle>Register a Bee Game League Team</PageTitle>
              <p className='-mt-4 mb-4 text-xs'>This form is to register a new team, not to join an existing team. If you want to join an existing team, ask your team captain for the join url. To register a new team, fill out this form and you will be given a join url to distribute to your team members.</p>
              <p className='-mt-4 mb-4 text-xs'>As team captain, understand that registering a team means you will be expected to work with another team captain to schedule a match EVERY WEEK for up to 11 weeks this season. Make sure you read the <Link target='_blank' href='https://league.beegame.gg/help/'>Help</Link>Help section for Rules and Guidance.</p>
              <FormBox>
                <label>Team Name</label>
                <Input required placeholder='Team Name' value={name} onChange={e => setName(e.target.value)} />
              </FormBox>
              <FormBox>
                <label>Circuit</label>
                <Select value={circuit} onChange={e => setCircuit(e.target.value)}>
                  <option>Select a circuit</option>
                  { circuits.map(circuit => (
                    <option key={circuit.id} value={circuit.id}>{circuit.name}</option>
                  ))}
                </Select>
              </FormBox>

              <Button
                type='button'
                onClick={handleSubmit}>
                  Register
              </Button>
              { error
                ? (
                  <Error className='ml-4' error={error} />
                )
                : null }
            </CenterContent>
          )
      }
    </Chrome>
  )
}

export default RegisterTeam
