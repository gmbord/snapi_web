import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { get, post } from "../../utilities";

import "./NavBar.css";

const GOOGLE_CLIENT_ID = "836812235763-0p6othcputc28hmqlgdbevk2ar43k505.apps.googleusercontent.com";

const NavBar = ({ userId, handleLogin, handleLogout }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    get("/api/whoami")
      .then((user) => {
        if (user.role) {
          setUserRole(user.role);
          console.log("User Role:", user.role);
        }
      })
      .catch((error) => {
        console.error("Error fetching user role:", error);
      });
  }, []);

  useEffect(() => {
    console.log("UserRole State:", userRole);
  }, [userRole]);

  return (
    <nav className="NavBar-container">
      <a href="/">
        <img src="/favicon.ico" />
      </a>

      {userId && (
        <div className="NavBar-linkContainer u-inlineBlock">
          <Link to="/queue/" className="NavBar-link">
            Queue
          </Link>
          <Link to="/active/" className="NavBar-link">
            Active Game
          </Link>
          <Link to="/stats/" className="NavBar-link">
            Stats
          </Link>

          <Link to="/settings" className="NavBar-link">
            User Settings
          </Link>
        </div>
      )}

      <div className="NavBar-GoogleLogin u-inlineBlock">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {userId ? (
            <button
              onClick={() => {
                googleLogout();
                handleLogout();
              }}
            >
              Logout
            </button>
          ) : (
            <GoogleLogin
              onSuccess={(response) => {
                handleLogin(response);
              }}
              onError={(err) => console.log(err)}
            />
          )}
        </GoogleOAuthProvider>
      </div>
    </nav>
  );
};

export default NavBar;
