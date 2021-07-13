import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import "./index.css";
import App from "./App";
import Resume from "./Resume";
import reportWebVitals from "./reportWebVitals";
import Navbar from "./Navbar";
import { DarkTheme } from "./darkTheme";
import Footer from "./Footer";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={DarkTheme}>
      <Navbar />
      <Router>
        <Switch>
          <Route exact path={"/"}>
            <App />
          </Route>
          <Route path={"/resume"}>
            <Resume />
          </Route>
        </Switch>
      </Router>
      <Footer />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
