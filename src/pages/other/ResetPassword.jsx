import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosconfig";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axiosInstance.post(`/reset-password/${token}`, {
        newPassword
      });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login-register");
      }, 3000); // Redirect to login after 3 seconds
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="reset-password-area">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-12 mx-auto">
            <div className="reset-password-wrapper">
              <h4>Reset Password</h4>
              <form onSubmit={handleSubmit}>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <div className="button-box text-center">
                  <button type="submit">Reset Password</button>
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

export default ResetPassword;
