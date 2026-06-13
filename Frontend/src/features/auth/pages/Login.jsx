import React,{useState } from 'react'
import "../auth.form.scss";
import { useNavigate,Link } from "react-router-dom";
import { useAuth } from '../hooks/useAuth.js';




export default function Login() {
  const {loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit =async (e) => {
    e.preventDefault()
    handleLogin({ email, password });
      navigate("/");
  }

  if(loading) {
    return <main><h1>Loading...</h1></main >
  }



  return (
    <main>
      <div className="form-container">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="primary-button" type="submit" disabled={loading}>
            Login
          </button>
        </form>

        <p className="redirect-text">
          Don't have an account?{" "}
          <Link to="/register" className="redirect-link">
            Register here
          </Link>
        </p>

      </div>
    </main>
  )
}