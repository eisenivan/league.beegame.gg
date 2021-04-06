import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import cookie from 'react-cookies'
import fetch from './modules/fetch-with-headers'
import getApiUrl from './modules/get-api-url'

import Home from './screens/Home'
import Circuits from './screens/Circuits'
import Circuit from './screens/Circuit'
import Teams from './screens/Teams'
import Team from './screens/Team'
import Player from './screens/Player'
import Profile from './screens/Profile'
import RegisterTeam from './screens/RegisterTeam'
import handleError from './modules/handle-error'
import nukeTokens from './modules/nuke-tokens'

async function setUserCookies () {
  const meJson = await fetch(`${getApiUrl()}me/?format=json`)
    .then(data => data.json())
    .catch(handleError)

  if (meJson.id) {
    cookie.save('userId', meJson.player.id, { path: '/', secure: !process.env.NODE_ENV === 'development' })
    cookie.save('name', meJson.first_name, { path: '/', secure: !process.env.NODE_ENV === 'development' })
  }
}

function App () {
  const token = cookie.load('token', true)

  if (token) {
    setUserCookies()
  } else {
    nukeTokens()
  }

  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          <Home />
        </Route>
        <Route path='/teams' exact>
          <Teams />
        </Route>
        <Route path='/teams/:id/:code?' exact>
          <Team />
        </Route>
        <Route path='/circuits' exact>
          <Circuits />
        </Route>
        <Route path='/circuits/:id'>
          <Circuit />
        </Route>
        <Route path='/player/:id'>
          <Player />
        </Route>
        <Route path='/profile'>
          <Profile />
        </Route>
        <Route path='/register'>
          <RegisterTeam />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
