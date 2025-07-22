// Import dependencies
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "../axiosConfig"; // Axios instance with baseURL
import setAuthToken from "../utils/setAuthToken"; // Set/remove auth token in headers

// Create the context
export const AuthContext = createContext();

// AuthProvider component
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On app load, check token and fetch user
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem("authToken");
          setAuthToken(null);
          setAuth({ isAuthenticated: false, user: null });
          setLoading(false);
          return;
        }

        // Valid token
        setAuthToken(token);

        // Fetch user from WordPress
        axios
          .get("/users/me") // ✅ WordPress endpoint
          .then((res) => {
            setAuth({
              isAuthenticated: true,
              user: res.data, // WordPress user object
            });
          })
          .catch(() => {
            localStorage.removeItem("authToken");
            setAuthToken(null);
            setAuth({
              isAuthenticated: false,
              user: null,
            });
          })
          .finally(() => setLoading(false));
      } catch (err) {
        localStorage.removeItem("authToken");
        setAuthToken(null);
        setAuth({ isAuthenticated: false, user: null });
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Login handler: call this after successful login
  const login = (userData, token) => {
    setAuthToken(token); // Save token to axios and localStorage
    setAuth({
      isAuthenticated: true,
      user: userData,
    });
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setAuth({
      isAuthenticated: false,
      user: null,
    });
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
