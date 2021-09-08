import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import "./index.css";
import Resume from "./pages/Resume";
import reportWebVitals from "./reportWebVitals";
import Navbar from "./Navbar";
import { DarkTheme } from "./darkTheme";
import MyDevLessons from "./pages/MyDevLessons";
import FaveQuotes from "./pages/FaveQuotes";
import Home from "./pages/Home";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={DarkTheme}>
      <Navbar />
      <Router>
        <Switch>
          <Route exact path={"/"}>
            <Home />
          </Route>
          <Route path={"/resume"}>
            <Resume />
          </Route>
          <Route path={"/fave-quotes"}>
            <FaveQuotes />
          </Route>
          <Route path={"load-data-on-initial-render"}>
            <MyDevLessons />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
