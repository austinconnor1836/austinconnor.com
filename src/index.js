import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Switch, BrowserRouter as Router } from "react-router-dom"
import './styles.css'
import App from './App'
import Resume from './components/Resume'
import { Nav } from "./Styles"


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Nav />
    <Switch>
      <Route exact path="/">
    <App />
    </Route>
    <Route exact path="/resume">
      <Resume />
    </Route>
    </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
