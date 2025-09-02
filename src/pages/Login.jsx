import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Login = ({ onLoginSuccess }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // ✅ New success message state
  const [loading, setLoading] = useState(false);

  // 🔐 Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/login`,
        { phone, password }
      );

      localStorage.setItem("isLoggedIn", "true");

      console.log("Login successful:", response.data);

      // ✅ Set success message
      setSuccess("Login successful!");

      // ⏳ Slight delay to show message before navigating
      setTimeout(() => {
        onLoginSuccess(); // Navigate to dashboard
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <div className="heading">Sign In</div>
        <form onSubmit={handleSubmit} className="form">
          <input
            required
            className="input"
            type="tel"
            name="phone"
            id="phone"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            required
            className="input"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            className="login-button"
            type="submit"
            value={loading ? "Signing In..." : "Sign In"}
            disabled={loading}
          />

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}
        </form>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #e7f0f7;

  .container {
    max-width: 350px;
    background: linear-gradient(0deg, #fff 0%, #f4f7fb 100%);
    border-radius: 40px;
    padding: 25px 35px;
    border: 5px solid #fff;
    box-shadow: rgba(133, 189, 215, 0.88) 0px 30px 30px -20px;
    width: 100%;
  }

  .heading {
    text-align: center;
    font-weight: 900;
    font-size: 30px;
    color: rgb(16, 137, 211);
  }

  .form {
    margin-top: 20px;
  }

  .form .input {
    width: 100%;
    background: white;
    border: none;
    padding: 15px 20px;
    border-radius: 20px;
    margin-top: 15px;
    box-shadow: #cff0ff 0px 10px 10px -5px;
    border-inline: 2px solid transparent;
  }

  .form .input::placeholder {
    color: rgb(170, 170, 170);
  }

  .form .input:focus {
    outline: none;
    border-inline: 2px solid #12b1d1;
  }

  .form .login-button {
    display: block;
    width: 100%;
    font-weight: bold;
    background: linear-gradient(45deg, #1089d3 0%, #12b1d1 100%);
    color: white;
    padding-block: 15px;
    margin: 20px auto;
    border-radius: 20px;
    border: none;
    box-shadow: rgba(133, 189, 215, 0.88) 0px 20px 10px -15px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }

  .form .login-button:hover {
    transform: scale(1.03);
  }

  .form .login-button:active {
    transform: scale(0.95);
  }

  .form .login-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error-text {
    color: red;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
  }

  .success-text {
    color: green;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
  }
`;

export default Login;
