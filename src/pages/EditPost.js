import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { getPostById, editPost } from "../api/posts";
import { AuthContext } from "../context/AuthContext";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [post, setPost] = useState({
    title: "",
    content: "",
    category: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const existingPost = await getPostById(id);

        if (!existingPost) {
          alert("Post not found.");
          return navigate("/");
        }

        if (existingPost.author !== auth.user?.email) {
          alert("You are not authorized to edit this post.");
          return navigate("/");
        }

        setPost({
          title: existingPost.title,
          content: existingPost.content,
          category: existingPost.category || "",
        });
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("Could not fetch post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, auth.user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editPost(id, {
        ...post,
        updatedAt: new Date().toISOString(),
      });
      alert("Post updated successfully!");
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

        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={post.category}
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
