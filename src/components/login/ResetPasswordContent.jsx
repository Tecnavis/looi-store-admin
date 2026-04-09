import React, { useState } from 'react'
import Footer from '../footer/Footer'
import { Link } from 'react-router-dom'
import axiosInstance from '../../../axiosConfig'

const ResetPasswordContent = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    if (!email) {
      setError('Please enter your email address.')
      return
    }
    setLoading(true)
    try {
      const response = await axiosInstance.post('/forgot-password', { email })
      setMessage(response.data.message || 'Password reset email sent! Check your inbox.')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="main-content login-panel">
        <div className="login-body">
            <div className="top d-flex justify-content-between align-items-center">
                <div className="logo">
                    {/* <img src="assets/images/logo-big.png" alt="Logo"/> */}
                </div>
                <Link to="/"><i className="fa-duotone fa-house-chimney"></i></Link>
            </div>
            <div className="bottom">
                <h3 className="panel-title">Forgot Password</h3>
                <p className="text-muted mb-3" style={{ fontSize: '14px' }}>
                  Enter your email address and we will send you a password reset link.
                </p>
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group mb-30">
                        <span className="input-group-text"><i className="fa-regular fa-envelope"></i></span>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100 login-btn"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                <div className="other-option mt-3">
                    <p className="mb-0">Remember your password? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default ResetPasswordContent
