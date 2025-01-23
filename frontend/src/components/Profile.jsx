import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/Profile.css";
import { getUserRole } from "../js/Auth";

const Profile = () => {
  const navigate = useNavigate();
  const userRole = getUserRole();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const validateForm = () => {
    if (
      !formData.oldPassword.trim() ||
      !formData.newPassword.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setError("All fields are required.");
      return false;
    }

    if (formData.newPassword.length < 10) {
      setError("Password must be at least 10 characters long.");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    if (formData.oldPassword === formData.newPassword) {
      setError("New password has to be different");
    }

    setError("");
    return true;
  };

  const handleLogout = () => {
    localStorage.clear();

    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      const { oldPassword, newPassword } = formData;
      const response = await fetch(
        "http://localhost:8080/authority/changepassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      if (response.ok) {
        console.log("Password changed successfully!");
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setIsExpanded(false);
        setError("");
        setShake(false);
      } else {
        console.error("Failed to change password.");
        setError("Failed to change password. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const toggleChangePasswordForm = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  const handleMyOrdersClick = () => {
    navigate("/OrderHistory");
  };

  return (
    <>
      <h1>MY PROFILE</h1>
      <div className="container">
        {userRole !== "ROLE_ADMIN" && (
          <div className="add-div" onClick={handleMyOrdersClick}>
            <p className="btn-text" id="profile-btn">
              MY ORDERS
            </p>
          </div>
        )}

        <div className="add-div" onClick={handleLogout}>
          <p className="btn-text" id="profile-btn">
            LOGOUT
          </p>
        </div>

        <div
          className={`add-div ${isExpanded ? "expanded" : ""} ${
            shake ? "shake" : ""
          }`}
          onClick={toggleChangePasswordForm}
        >
          {!isExpanded ? (
            <p className="btn-text" id="profile-btn">
              CHANGE PASSWORD
            </p>
          ) : (
            <form onClick={handleFormClick}>
              <div
                className={`input-div ${error ? "input-div-error shake" : ""}`}
              >
                <input
                  type="password"
                  name="oldPassword"
                  required
                  placeholder="Old Password"
                  value={formData.oldPassword}
                  onChange={handleChange}
                />
                <input
                  type="password"
                  name="newPassword"
                  required
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <div className="button-div">
                <button
                  type="button"
                  className={error ? "btn-error" : "btn"}
                  onClick={handleSubmit}
                >
                  <p className="btn-text">SAVE</p>
                </button>
              </div>
            </form>
          )}
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>
    </>
  );
};

export default Profile;
