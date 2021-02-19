import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import Home from './screens/Home'
import Circuits from './screens/Circuits'

function App () {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route path='/circuits'>
          <Circuits />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
