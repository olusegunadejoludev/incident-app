// Import dependencies
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import setAuthToken from "../utils/setAuthToken";

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

  // On app load, check localStorage for user
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");

    if (storedUser) {
      setAuth({
        isAuthenticated: true,
        user: JSON.parse(storedUser),
      });
    } else {
      setAuth({
        isAuthenticated: false,
        user: null,
      });
    }

    setLoading(false);
  }, []);

  // Login handler: call this after successful login/register
  const login = (userData) => {
    setAuthToken(userData); // Save to localStorage
    setAuth({
      isAuthenticated: true,
      user: userData,
    });
  };

  // Logout handler
  const logout = () => {
    setAuthToken(null); // Remove from localStorage
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
