import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import cookie from 'react-cookies'
import fetch from './modules/fetch-with-headers'

import Home from './screens/Home'
import Circuits from './screens/Circuits'
import Circuit from './screens/Circuit'
import Teams from './screens/Teams'
import Team from './screens/Team'
import Player from './screens/Player'
import Profile from './screens/Profile'

async function setUserCookies () {
  const me = await fetch('https://api-staging.beegame.gg/me/?format=json')
  const meJson = await me.json()
  cookie.save('userid', meJson.player.id, { path: '/', secure: !process.env.NODE_ENV === 'development' })
  cookie.save('name', meJson.first_name, { path: '/', secure: !process.env.NODE_ENV === 'development' })
}

function App () {
  const token = cookie.load('token', true)
  const userId = cookie.load('userId', true)

  if (token && !userId) {
    setUserCookies()
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
        <Route path='/teams/:id' exact>
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
      </Switch>
    </Router>
  )
}

export default App
