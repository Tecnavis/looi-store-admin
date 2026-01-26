import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosconfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/forgot-password", { email });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login-register");
      }, 3000); // Redirect to login after 3 seconds
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="forgot-password-area">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-12 mx-auto mt-5">
            <div className="forgot-password-wrapper">
              <h4>Forgot Password</h4>
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="button-box text-center mt-4">
                  <button type="submit">Send Reset Link</button>
                </div>
              </form>

              {message && <p className="success-message">{message}</p>}
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
