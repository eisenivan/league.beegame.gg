import cookie from 'react-cookies'

async function nukeTokens () {
  await cookie.remove('token', { path: '/' })
  await cookie.remove('userId', { path: '/' })
  await cookie.remove('name', { path: '/' })
}

export default nukeTokens
