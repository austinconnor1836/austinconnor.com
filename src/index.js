import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Switch, BrowserRouter as Router } from "react-router-dom"
import './styles.css'
import App from './App'
import { Nav } from "./Styles"


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Nav />
    <Switch>
      <Route exact path="/">
    <App />
    </Route>
    </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
