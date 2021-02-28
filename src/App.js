import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import Home from './screens/Home'
import Circuits from './screens/Circuits'
import Circuit from './screens/Circuit'
import Teams from './screens/Teams'
import Team from './screens/Team'
import Profile from './screens/Profile'

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
        <Route path='/teams/:id'>
          <Team />
        </Route>
        <Route path='/circuits' exact>
          <Circuits />
        </Route>
        <Route path='/circuits/:id'>
          <Circuit />
        </Route>
        <Route path='/profile'>
          <Profile />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
