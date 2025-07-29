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
      const existingUsers = await fetchUsers();

      const userExists = existingUsers.find(
        (u) => u.username === username || u.email === email.toLowerCase()
      );

      if (userExists) {
        setAlert({
          message: "Username or email already exists",
          variant: "danger",
        });
        setLoading(false);
        return;
      }

      // Register user in jsonbin
      await registerUser({
        username,
        email: email.toLowerCase(),
        password,
        role: "user", // default role
      });

      // Simulate login immediately
      const user = await loginUser(username, password);

      if (user) {
        login(user); // update context
        setAlert({ message: "Registered and logged in!", variant: "success" });
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setAlert({ message: "Login failed after registration", variant: "danger" });
      }
    } catch (err) {
      console.error(err);
      setAlert({
        message: "Something went wrong. Please try again.",
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
