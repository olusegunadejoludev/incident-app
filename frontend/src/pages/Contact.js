import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setAlert(
      <Alert variant="success">
        Thank you for reaching out! We'll get back to you soon.
      </Alert>
    );

    setFormData({ name: "", email: "", message: "" });

    // You can integrate EmailJS, Formspree, or your own API here.
  };

  return (
    <Container className="contact-form py-5">
      <div className="contact-form-wrap mx-auto" style={{ maxWidth: "600px" }}>
        <h1>Contact Us</h1>

        {alert && alert}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              aria-label="Your name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-label="Your email"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMessage">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Enter your message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              aria-label="Your message"
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={!!alert}>
            Submit
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Contact;
