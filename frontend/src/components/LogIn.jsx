import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUserRole } from "../js/Auth";
import "../stylesheets/LogIn.css";

const LogIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.username.trim() || !formData.password.trim()) {
      setErrorMessage("All fields are required.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setError(false);

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        username: formData.username.trim(),
        password: formData.password,
      });

      const { token } = response.data;
      localStorage.setItem("jwtToken", token);

      const userRole = getUserRole();
      if (userRole === "ROLE_USER") {
        localStorage.setItem("cart", JSON.stringify({}));
      }

      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      setError(true);
      setErrorMessage("Invalid username or password.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleSignUpRedirect = () => {
    navigate("/SignUp");
  };

  return (
    <div className="container">
      <h2 id="login-text">LOG IN</h2>
      <div className={`formula-div ${shake ? "shake" : ""}`}>
        <div className="login-div">
          <form onSubmit={handleSubmit} className="profile-form">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </form>
        </div>
        <div className="button-div">
          <button
            type="button"
            id="login-btn"
            className={`btn ${error ? "btn-error" : ""}`}
            onClick={handleSubmit}
          >
            <p className="btn-text">LOG IN</p>
          </button>
        </div>
      </div>
      <div className="button-div">
        <button
          id="sign-up-btn"
          className="btn"
          type="button"
          onClick={handleSignUpRedirect}
        >
          <p className="btn-text">SIGN UP</p>
        </button>
      </div>
      {error && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default LogIn;
