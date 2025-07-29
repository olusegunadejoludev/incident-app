import { useState, useContext } from "react";
import { Alert, Button, Form, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../api/auth.js"; // ← JsonBin API function to login user

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage(null);

    try {
      const user = await loginUser(username, password);

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Update global auth context
      login(user);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      setAlertMessage(
        error.message === "Invalid credentials"
          ? "Invalid username or password."
          : "Something went wrong. Please try again later."
      );
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
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
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
