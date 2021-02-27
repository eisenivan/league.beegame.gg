import cookie from 'react-cookies'

async function makeRequest (url) {
  const token = cookie.load('token')
  const res = await fetch(url, { // eslint-disable-line
    headers: {
      'Authorization': `Token ${token}`
    }
  })

  return res
}

export default makeRequest
