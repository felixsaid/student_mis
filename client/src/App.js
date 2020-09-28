import React, { Fragment, useState, useEffect } from "react";
import "./App.css";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

//components
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

toast.configure();

function App() {
  const [isAuthenticated, setisAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setisAuthenticated(boolean);
  };

  async function isAuth() {
    try {
      const response = await fetch("http://localhost:5001/v1/auth/is-verify", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseResponse = await response.json();

      parseResponse === true
        ? setisAuthenticated(true)
        : setisAuthenticated(false);
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    isAuth();
  });

  return (
    <Fragment>
      <Router>
        <Redirect exact from="/" to="login" />;
        <div className="container">
          <Switch>
            <Route
              exact
              path="/login"
              render={(props) =>
                !isAuthenticated ? (
                  <Login {...props} setAuth={setAuth} />
                ) : (
                  <Redirect to="/dashboard" />
                )
              }
            />

            <Route
              exact
              path="/register"
              render={(props) =>
                !isAuthenticated ? (
                  <Register {...props} setAuth={setAuth} />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />

            <Route
              exact
              path="/dashboard"
              render={(props) =>
                isAuthenticated ? (
                  <Dashboard {...props} setAuth={setAuth} />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
          </Switch>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
