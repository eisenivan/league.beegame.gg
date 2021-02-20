import React, { useState, useEffect } from 'react'
import Chrome from '../components/Chrome'
import { useParams } from 'react-router-dom'

function Circuits () {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [circuit, setCircuit] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://kqb.buzz/api/leagues/4/seasons/6/circuits/${id}/?format=json`) // eslint-disable-line
      const json = await response.json()
      console.log(json)
      setCircuit(json)
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
            <pre>
              {JSON.stringify(circuit, null, 2)}
            </pre>
          )
      }
    </Chrome>
  )
}

export default Circuits
