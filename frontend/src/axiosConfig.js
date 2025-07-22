// Import axios library
import axios from "axios";

// Create a custom axios instance
const axiosInstance = axios.create({
  // Set base URL to WordPress REST API
  baseURL: "https://yourwordpresssite.com/wp-json/wp/v2",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to inject JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// (Optional) Handle 401 unauthorized globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
