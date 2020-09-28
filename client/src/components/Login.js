import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = ({ setAuth }) => {
  const [inputs, setinputs] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputs;

  const onChange = (e) => {
    setinputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = { email, password };

      const response = await fetch("http://localhost:5001/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseResponse = await response.json();

      if (parseResponse.token) {
        localStorage.setItem("token", parseResponse.token);

        setAuth(true);

        toast.success("Succefully Logged in.");
      } else {
        setAuth(false);
        toast.error(parseResponse);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <div className="loginPage">
        <h1 className="text-center my-5">Login</h1>
        <form onSubmit={onFormSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-control my-3"
            value={email}
            onChange={(e) => onChange(e)}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control my-3"
            value={password}
            onChange={(e) => onChange(e)}
          />

          <button className="btn btn-success btn-block">Submit</button>
        </form>

        {/* <Link to="/register">Register</Link> */}
      </div>
    </Fragment>
  );
};

export default Login;
