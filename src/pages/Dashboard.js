import React, { useState, useEffect, useContext } from "react";
import { Container, Card, Spinner, Alert, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllPosts, deletePost } from "../api/posts";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getAllPosts();
        const sortedPosts = allPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setError("Failed to fetch blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const truncateContent = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    const lastSpace = text.lastIndexOf(" ", maxLength);
    const cutAt = lastSpace !== -1 ? lastSpace : maxLength;
    return text.substring(0, cutAt) + "...";
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await deletePost(postId, auth.user);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      alert("Post deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error);
      alert("You are not allowed to delete this post.");
    }
  };

  return (
    <Container className="mt-4">
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <h1>Blog Posts</h1>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading &&
        !error &&
        posts.map((post) => (
          <Card key={post.id} className="my-3">
            {post.image && (
              <Card.Img
                variant="top"
                src={post.image}
                alt={post.title}
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
            )}

            <Card.Body>
              <Card.Title>{post.title}</Card.Title>

              {post.category && (
                <Badge bg="info" className="mb-2 text-white">
                  {post.category}
                </Badge>
              )}

              <Card.Text>{truncateContent(post.content, 200)}</Card.Text>

              <small className="text-muted">By {post.author}</small> <br />
              <small className="text-muted">
                {new Date(post.createdAt).toLocaleString()}
              </small>

              <div className="mt-2 d-flex gap-2">
                <Link to={`/posts/${post.id}`} className="btn btn-primary">
                  Read More
                </Link>

                {auth.user?.email === post.author && (
                  <Link to={`/edit/${post.id}`} className="btn btn-warning">
                    Edit
                  </Link>
                )}

                {(auth.user?.email === post.author || auth.user?.role === "admin") && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </Card.Body>
          </Card>
        ))}
    </Container>
  );
};

export default Dashboard;
