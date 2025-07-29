import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Button, Spinner } from "react-bootstrap";
import { getPostById, deletePost } from "../api/posts";
import { AuthContext } from "../context/AuthContext";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPostById(id);

        if (!fetchedPost) {
          alert("Post not found.");
          return navigate("/");
        }

        setPost(fetchedPost);
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("Could not load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (!confirm) return;

    try {
      await deletePost(id, auth.user);
      alert("Post deleted.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("You are not allowed to delete this post.");
    }
  };

  if (loading || !post) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1>{post.title}</h1>

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="img-fluid mb-3"
          style={{ maxHeight: "400px", objectFit: "cover" }}
        />
      )}

      <p>{post.content}</p>

      <p>
        <strong>Posted by:</strong> {post.author}
      </p>
      <p>
        <strong>Date:</strong> {new Date(post.createdAt).toLocaleString()}
      </p>

      {(auth.user?.email === post.author || auth.user?.role === "admin") && (
        <div className="mt-3">
          {auth.user?.email === post.author && (
            <Button variant="warning" as={Link} to={`/edit/${post.id}`}>
              Edit
            </Button>
          )}
          <Button variant="danger" className="ms-2" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}
    </Container>
  );
};

export default BlogPost;
