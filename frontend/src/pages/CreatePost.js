// CreatePost.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import axios from "../axiosConfig"; // Make sure this has baseURL to WP site

const CreatePost = () => {
  const [post, setPost] = useState({ title: "", content: "" });
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/wp-json/wp/v2/posts",
        {
          title: post.title,
          content: post.content,
          status: "publish", // Or 'draft'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const postId = response.data.id;
      navigate(`/posts/${postId}`);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
    }
  };

  return (
    <Container className="create-post mt-5">
      <h1>Create New Post</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            placeholder="Enter post title"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="content">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            name="content"
            rows={6}
            value={post.content}
            onChange={handleChange}
            placeholder="Enter post content"
            required
          />
        </Form.Group>
        <Button type="submit" variant="success">
          Publish
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePost;
