import React, { useState } from "react";
import Footer from "../footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";

const LoginContent2 = () => {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/admin-login", {
        username,
        password
      });

      console.log("Login success:", response.data);

      // save JWT token
      localStorage.setItem("token", response.data.token);

      // redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="main-content login-panel login-panel-2">
      <h3 className="panel-title">Login</h3>

      <div className="login-body login-body-2">
        <div className="top d-flex justify-content-between align-items-center">
          <div className="logo">
            <img src="assets/images/looi-bl.png" alt="Logo"/>
          </div>
          <Link to="/">
            <i className="fa-duotone fa-house-chimney"></i>
          </Link>
        </div>

        <div className="bottom">

          {error && (
            <div className="alert alert-danger mb-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="input-group mb-30">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                required
              />
              <span className="input-group-text">
                <i className="fa-regular fa-user"></i>
              </span>
            </div>

            <div className="input-group mb-20">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />
              <span className="input-group-text">
                <i className="fa-regular fa-lock"></i>
              </span>
            </div>

            <div className="d-flex justify-content-between mb-30">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="loginCheckbox"
                />
                <label className="form-check-label text-white">
                  Remember Me
                </label>
              </div>

              <Link to="/resetPassword" className="text-white fs-14">
                Forgot Password?
              </Link>
            </div>

            <button className="btn btn-primary w-100 login-btn" type="submit">
              Login
            </button>

          </form>

          <div className="other-option">
            <p className="mb-0">
              Don't have an account?
              <Link to="/registration2" className="text-white text-decoration-underline">
                create
              </Link>
            </p>
          </div>

        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default LoginContent2;