import React, { useState, useEffect } from 'react'
import Chrome from '../components/Chrome'
import { Link, useParams } from 'react-router-dom'
import { PageTitle, PageSubtitle } from '../components/elements'
import getApiUrl from '../modules/get-api-url'
import handleError from '../modules/handle-error'

function Teams () {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [caster, setCaster] = useState([])

  useEffect(() => {
    const fetchData = async () => {      
      setLoading(true)
      const response = await fetch(`${getApiUrl()}casters/${id}/`)
        .then(data => data.json())
        .catch(handleError)

      setCaster(response)
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <Chrome>
      {
        loading
          ? <div>loading...</div>
          : (
            <div>
              <PageTitle>{caster.name}</PageTitle>
              <PageSubtitle>
                {caster.player.name_phonetic || ''} {caster.player.pronouns ? `(${caster.player.pronouns})` : ''}</PageSubtitle>
              <div className='mt-4'>{caster.player.bio}</div>              

              <a href={caster.stream_link} class={`flex mt-5 ${caster.player.twitch_username ? "" : "hidden"}`}>
                  twitch.tv/{ caster.player.twitch_username }
              </a>         

              <span></span>
            </div>
          )
      }
    </Chrome>
  )
}

export default Teams
