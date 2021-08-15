import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Home from './screens/Home'
import Circuits from './screens/Circuits'
import Circuit from './screens/Circuit'
import Groups from './screens/Group'
import Teams from './screens/Teams'
import Team from './screens/Team'
import Casters from './screens/Casters'
import Caster from './screens/Caster'
import Player from './screens/Player'
import Profile from './screens/Profile'
import RegisterTeam from './screens/RegisterTeam'
import Help from './screens/Help'
import Links from './screens/Links'

function App () {
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
        <Route path='/casters' exact>
          <Casters />
        </Route>
        <Route path='/casters/:id' exact>
          <Caster />
        </Route>
        <Route path='/circuits' exact>
          <Circuits />
        </Route>
        <Route path='/circuits/:id' exact>
          <Circuit />
        </Route>
        <Route path='/circuits/:id/:group'>
          <Groups />
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
        <Route path='/help'>
          <Help />
        </Route>
        <Route path='/links'>
          <Links />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
