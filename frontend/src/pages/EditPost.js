// EditPost.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import axios from "../axiosConfig";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const [post, setPost] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/wp-json/wp/v2/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPost({
          title: response.data.title.raw || response.data.title.rendered,
          content: response.data.content.raw || response.data.content.rendered,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("Could not fetch post.");
      }
    };

    fetchPost();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/wp-json/wp/v2/posts/${id}`,
        {
          title: post.title,
          content: post.content,
          status: "publish",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post.");
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="edit-post mt-5">
      <h1>Edit Post</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
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
            required
          />
        </Form.Group>
        <div className="d-flex justify-content-between">
          <Button type="submit" variant="primary">
            Update Post
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditPost;
