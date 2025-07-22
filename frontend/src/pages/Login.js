// Importing necessary hooks, components, and utilities
import { useState, useContext } from "react";
import { Alert, Button, Form, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axiosConfig"; // Axios instance
import setAuthToken from "../utils/setAuthToken"; // Utility to set token
import { AuthContext } from "../context/AuthContext"; // Global auth context

const Login = () => {
  const [username, setUsername] = useState(""); // Username or email
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false); // For UX during login

  const { login } = useContext(AuthContext); // Access login method from context
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage(null); // Clear previous alerts

    try {
      const response = await axios.post("/jwt-auth/v1/token", {
        username,
        password,
      });

      const { token, user_display_name } = response.data;

      // Set token in Axios for future requests
      setAuthToken(token);

      // Save token in localStorage (used by AuthContext)
      localStorage.setItem("authToken", token);

      // Update global auth context with user info
      login({
        name: user_display_name,
        username: username,
      });

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 403 || status === 401) {
          setAlertMessage("Invalid username or password.");
        } else if (status === 404) {
          setAlertMessage(
            <span>
              User not found. Please{" "}
              <Link to="/register" className="alert-link">
                sign up
              </Link>.
            </span>
          );
        } else {
          setAlertMessage("Something went wrong. Please try again later.");
        }
      } else {
        setAlertMessage("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      <div className="p-4 border rounded shadow-sm bg-white">
        <h1 className="h3 mb-4 text-center">Login to Your Account</h1>

        {alertMessage && <Alert variant="danger">{alertMessage}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username or Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>

        <p className="mt-3 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="fw-bold">
            Sign up
          </Link>
        </p>
      </div>
    </Container>
  );
};

export default Login;
