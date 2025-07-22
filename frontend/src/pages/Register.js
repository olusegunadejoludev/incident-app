import { useState, useContext } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import setAuthToken from "../utils/setAuthToken";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [alert, setAlert] = useState({ message: "", variant: "" });
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { username, email, password, confirmpassword } = formData;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignUp = async (e) => {
    e.preventDefault();
    setAlert({ message: "", variant: "" });

    if (password !== confirmpassword) {
      setAlert({ message: "Passwords do not match", variant: "danger" });
      return;
    }

    setLoading(true);

    try {
      // Register the user (custom endpoint or plugin support)
      await axios.post("/wp/v2/users/register", {
        username,
        email: email.toLowerCase(),
        password,
      });

      // Auto-login after successful registration
      const loginRes = await axios.post("/jwt-auth/v1/token", {
        username,
        password,
      });

      const { token, user_display_name } = loginRes.data;

      // Set auth token globally and in storage
      setAuthToken(token);
      localStorage.setItem("authToken", token);

      // Update auth context
      login({
        name: user_display_name,
        username,
      });

      setAlert({ message: "Registered successfully!", variant: "success" });

      // Clear form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
      });

      // Navigate after short delay
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Registration failed, please try again.";
      setAlert({ message: errorMsg, variant: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      <div className="p-4 border rounded shadow-sm bg-white">
        <h1 className="h3 mb-4 text-center">Create an Account</h1>

        {alert.message && <Alert variant={alert.variant}>{alert.message}</Alert>}

        <Form onSubmit={handleSignUp}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={handleChange}
              name="username"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              name="email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={handleChange}
              name="password"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Re-enter your password"
              value={confirmpassword}
              onChange={handleChange}
              name="confirmpassword"
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </Form>

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" className="fw-bold">
            Login
          </Link>
        </p>
      </div>
    </Container>
  );
};

export default Register;
