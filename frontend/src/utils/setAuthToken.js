// Import custom axios instance for WordPress REST API
import axios from "../axiosConfig";

// Function to set/remove the JWT for axios and localStorage
const setAuthToken = (token) => {
  if (token) {
    // Set Authorization header
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("authToken", token);
  } else {
    // Remove token
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("authToken");
  }
};

export default setAuthToken;
