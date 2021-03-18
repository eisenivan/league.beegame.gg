import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Chrome from '../components/Chrome'
import fetch from '../modules/fetch-with-headers'
import handleError from '../modules/handle-error'
import { Input, Select, Button, FormBox, Error } from '../components/elements'

function RegisterTeam () {
  const [loading, setLoading] = useState(true)
  const [circuits, setCircuits] = useState([])
  const [circuit, setCircuit] = useState()
  const [name, setName] = useState('')
  const [error, setError] = useState()
  const history = useHistory()

  useEffect(() => {
    const fetchData = async () => {
      const circuits = await fetch('https://api-staging.beegame.gg/leagues/?format=json')
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

    fetch(`https://api-staging.beegame.gg/teams/`, requestOptions)
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
          ? <div>loading...</div>
          : (
            <div>
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
            </div>
          )
      }
    </Chrome>
  )
}

export default RegisterTeam
