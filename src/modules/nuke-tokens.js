import cookie from 'react-cookies'

function nukeTokens () {
  cookie.remove('token', { path: '/' })
  cookie.remove('userId', { path: '/' })
  cookie.remove('name', { path: '/' })
}

export default nukeTokens
