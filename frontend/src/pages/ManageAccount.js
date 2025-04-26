import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.js";
import NavBar from "../components/Navbar.js";
import Footer from "../components/Footer.js";
import "../components/css/homeCSS/homepage.css";
import "../components/css/accountCSS/manageAccount.css";
import { useAuth } from "../hooks/useAuth";

/**
 * Renders the account management page where users can update their profile.
 * @returns {JSX.Element} The ManageAccount component.
 */
function ManageAccount() {
  let navigate = useNavigate();
  let { user } = useAuth();

  // State for form fields
  let [userData, setUserData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    profilePicture: null,
    currentProfilePicture: null,
  });

  // State for displaying messages
  let [message, setMessage] = useState({ text: "", type: "" });

  // State for loading
  let [isLoading, setIsLoading] = useState(false);

  // State to track if user is logged in
  let [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    let fetchUserData = async () => {
      try {
        let response = await fetch(
          `${process.env.REACT_APP_API_BASE}/user/get-profile.php`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        let data = await response.json();

        if (data.success) {
          setUserData((prevState) => ({
            ...prevState,
            username: data.user.username,
            email: data.user.email,
            currentProfilePicture: data.user.profile_picture,
          }));
          setIsLoggedIn(true);
        } else {
          // Redirect to login if not logged in
          navigate("/login", { replace: true });
        }
      } catch (error) {
        setMessage({
          text: "Failed to fetch user data. Please try again later.",
          type: "error",
        });
      }
    };

    // Check if user is already authenticated from context
    if (user) {
      setUserData((prevState) => ({
        ...prevState,
        username: user.username,
        email: user.email,
        currentProfilePicture: user.profile_picture,
      }));
      setIsLoggedIn(true);
    } else {
      fetchUserData();
    }
  }, [user, navigate]);

  // Handle input changes
  let handleInputChange = (e) => {
    let { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle profile picture selection
  let handleFileChange = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      profilePicture: e.target.files[0],
    }));
  };

  // Handle form submission for general info update
  let handleInfoUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let formData = new FormData();
      formData.append("username", userData.username);
      formData.append("email", userData.email);

      let response = await fetch(
        `${process.env.REACT_APP_API_BASE}/user/update-info.php`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      let data = await response.json();

      if (data.success) {
        setMessage({
          text: "Profile information updated successfully!",
          type: "success",
        });
      } else {
        setMessage({
          text: data.message || "Failed to update profile information.",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred. Please try again later.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password update
  let handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate password match
    if (userData.newPassword !== userData.confirmPassword) {
      setMessage({
        text: "New passwords do not match.",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    try {
      let response = await fetch(
        `${process.env.REACT_APP_API_BASE}/user/update-password.php`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: userData.currentPassword,
            newPassword: userData.newPassword,
          }),
        }
      );

      let data = await response.json();

      if (data.success) {
        setMessage({
          text: "Password updated successfully!",
          type: "success",
        });
        // Clear password fields
        setUserData((prevState) => ({
          ...prevState,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        setMessage({
          text: data.message || "Failed to update password.",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred. Please try again later.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile picture upload
  let handleProfilePictureUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let formData = new FormData();
      formData.append("profilePicture", userData.profilePicture);

      let response = await fetch(
        `${process.env.REACT_APP_API_BASE}/user/update-profile-picture.php`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      let data = await response.json();
      console.log("Profile picture update response:", data);

      if (data.success) {
        setMessage({
          text: "Profile picture updated successfully!",
          type: "success",
        });

        // Add cache-busting parameter to prevent browser caching
        let imageUrl = data.profile_picture + "?t=" + new Date().getTime();

        // Update the current profile picture in state
        setUserData((prevState) => ({
          ...prevState,
          currentProfilePicture: imageUrl,
          profilePicture: null, // Reset the file input
        }));

        // Force refresh the image container completely
        let container = document.getElementById("profile-picture-container");
        if (container) {
          // Clear the container
          container.innerHTML = "";

          // Create a new image element
          let img = document.createElement("img");
          img.src = imageUrl;
          img.alt = "Current profile";
          img.className = "profile-img";

          // Add error handler
          img.onerror = function () {
            console.log("New image failed to load:", imageUrl);
            this.style.display = "none";

            // Create placeholder as fallback
            let placeholder = document.createElement("div");
            placeholder.className = "profile-placeholder";
            placeholder.textContent = userData.username
              ? userData.username.charAt(0).toUpperCase()
              : "?";

            container.appendChild(placeholder);
          };

          // Add the new image to the container
          container.appendChild(img);
        }

        // Reset the file input field
        let fileInput = document.getElementById("profilePicture");
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        setMessage({
          text: data.message || "Failed to update profile picture.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Profile picture update error:", error);
      setMessage({
        text: "An error occurred. Please try again later.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-page">
      <Header />
      <NavBar />

      <div className="account-container">
        <h1>Manage Your Account</h1>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        {isLoggedIn ? (
          <>
            <div className="account-sections">
              {/* Profile Picture Section on the Left */}
              <section className="account-section">
                <h2>Profile Picture</h2>
                <form onSubmit={handleProfilePictureUpdate}>
                  <div className="profile-picture-container">
                    <div
                      className="current-picture"
                      id="profile-picture-container"
                    >
                      {userData.currentProfilePicture ? (
                        <img
                          src={userData.currentProfilePicture}
                          alt="Current profile"
                          className="profile-img"
                          onError={(e) => {
                            console.log("Image failed to load:", e.target.src);
                            e.target.onerror = null;
                            e.target.style.display = "none";

                            // Creating a placeholder element and replacing it with a default iamge
                            let placeholder = document.createElement("div");
                            placeholder.className = "profile-placeholder";
                            placeholder.textContent = userData.username
                              ? userData.username.charAt(0).toUpperCase()
                              : "?";
                            e.target.parentNode.appendChild(placeholder);
                          }}
                        />
                      ) : (
                        <div className="profile-placeholder">
                          {userData.username
                            ? userData.username.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="profilePicture">
                        Upload New Profile Picture
                      </label>
                      <input
                        type="file"
                        id="profilePicture"
                        name="profilePicture"
                        onChange={handleFileChange}
                        accept="image/*"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isLoading || !userData.profilePicture}
                  >
                    {isLoading ? "Uploading..." : "Update Profile Picture"}
                  </button>
                </form>
              </section>

              {/* Profile Information Section in the Center */}
              <section className="account-section">
                <h2>Profile Information</h2>
                <form onSubmit={handleInfoUpdate}>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={userData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Information"}
                  </button>
                </form>
              </section>

              {/* Password Update Section on the Right Side */}
              <section className="account-section">
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordUpdate}>
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={userData.currentPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={userData.newPassword}
                      onChange={handleInputChange}
                      required
                      minLength="8"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={userData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      minLength="8"
                    />
                  </div>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </section>
            </div>
          </>
        ) : (
          <div className="loading-container">
            <p>Loading your account information...</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ManageAccount;
