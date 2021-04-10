import cookie from 'react-cookies'
import nukeTokens from './nuke-tokens'

async function makeRequest (url, params = {}) {
  const token = cookie.load('token', { path: '/' })
  console.log(token)
  const init = params
  if (token) {
    init.headers = {
      ...params.headers,
      'authorization': `Token ${token}`
    }
  }

  const res = await fetch(url, init) // eslint-disable-line
    .catch(e => console.error(e))

  // if the token is bad, delete it from local cookies
  if (res.status === 403) {
    // await nukeTokens()
    return { error: 'Invalid token.' }
  }

  return res
}

export default makeRequest
