import cookie from 'react-cookies'

async function makeRequest (url) {
  const token = cookie.load('token', { path: '/' })
  const init = {}
  if (token) {
    init.headers = {
      'authorization': `Token ${token}`
    }
  }

  const res = await fetch(url, init) // eslint-disable-line

  return res
}

export default makeRequest
