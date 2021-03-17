import React, { useState, useEffect } from 'react'
import Chrome from '../components/Chrome'
import fetch from '../modules/fetch-with-headers'
import handleError from '../modules/handle-error'
import { Input, Select, Button } from '../components/elements'

function RegisterTeam () {
  const [loading, setLoading] = useState(true)
  const [circuits, setCircuits] = useState([])
  const [circuit, setCircuit] = useState()
  const [name, setName] = useState('')

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
      .then((res) => {
        setName(res.name)
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
              <Input value={name} onChange={e => setName(e.target.value)} />
              <Select value={circuit} onChange={e => setCircuit(e.target.value)}>
                <option>Select a circuit</option>
                { circuits.map(circuit => (
                  <option key={circuit.id} value={circuit.id}>{circuit.name}</option>
                ))}
              </Select>
              <Button
                type='button'
                onClick={handleSubmit}>
                  Register
              </Button>
            </div>
          )
      }
    </Chrome>
  )
}

export default RegisterTeam
