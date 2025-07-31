import { useState, useContext } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { registerUser, fetchUsers, loginUser } from "../api/auth.js";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [alert, setAlert] = useState({ message: "", variant: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignUp = async (e) => {
    e.preventDefault();
    setAlert({ message: "", variant: "" });

    const { username, email, password, confirmpassword } = formData;

    if (password !== confirmpassword) {
      return setAlert({
        message: "Passwords do not match",
        variant: "danger",
      });
    }

    setLoading(true);

    try {
      const existingUsers = await fetchUsers();

      const userExists = existingUsers?.some(
        (u) =>
          u.username.toLowerCase() === username.toLowerCase() ||
          u.email.toLowerCase() === email.toLowerCase()
      );

      if (userExists) {
        setAlert({
          message: "Username or email already exists",
          variant: "danger",
        });
        return;
      }

      // Register user
      await registerUser({
        username,
        email: email.toLowerCase(),
        password,
        role: "user",
      });

      // Auto login
      const user = await loginUser(username, password);

      if (user) {
        login(user); // update global context
        setAlert({
          message: "Registered and logged in!",
          variant: "success",
        });

        // Delay to show success alert before redirecting
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        setAlert({
          message: "Login failed after registration",
          variant: "danger",
        });
      }
    } catch (err) {
      console.error("Registration Error:", err);
      setAlert({
        message: err.message || "Something went wrong. Please try again.",
        variant: "danger",
      });
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
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Form.Check
              type="checkbox"
              label="Show password"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mt-2"
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type={showConfirm ? "text" : "password"}
              name="confirmpassword"
              placeholder="Re-enter your password"
              value={formData.confirmpassword}
              onChange={handleChange}
              required
            />
            <Form.Check
              type="checkbox"
              label="Show confirm password"
              checked={showConfirm}
              onChange={() => setShowConfirm(!showConfirm)}
              className="mt-2"
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading}
          >
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
