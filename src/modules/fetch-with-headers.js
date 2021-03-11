import cookie from 'react-cookies'

async function makeRequest (url, params = {}) {
  const token = cookie.load('token', { path: '/' })
  const init = params
  if (token) {
    init.headers = {
      ...params.headers,
      'authorization': `Token ${token}`
    }
  }

  const res = await fetch(url, init) // eslint-disable-line
    .catch(e => console.error(e))

  return res
}

export default makeRequest
