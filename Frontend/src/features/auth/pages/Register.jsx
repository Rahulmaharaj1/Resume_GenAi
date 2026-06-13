import React,{useState} from "react";
import "../auth.form.scss";
import { useNavigate,Link } from "react-router-dom";
import { useAuth } from '../hooks/useAuth.js';

export default function Register() {
  const { loading, handleRegister } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister({ username, email, password });
    navigate("/");
  };

  if(loading) {
    return <main><h1>Loading...</h1></main >
  }

  return (
    <main>
      <div className="form-container">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Button */}
          <button className="primary-button" type="submit" disabled={loading}>
            Register
          </button>
        </form>

        <p className="redirect-text">
          Already have an account?{" "}
          <Link to="/login" className="redirect-link">
            Login here
          </Link>
        </p>

      </div>
    </main>
  );
}