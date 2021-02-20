import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import Home from './screens/Home'
import Circuits from './screens/Circuits'
import Circuit from './screens/Circuit'

function App () {
  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          <Home />
        </Route>
        <Route path='/circuits' exact>
          <Circuits />
        </Route>
        <Route path='/circuits/:id'>
          <Circuit />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
