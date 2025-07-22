// BlogPost.js
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Button, Spinner } from "react-bootstrap";
import axios from "../axiosConfig";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [authorName, setAuthorName] = useState("");

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/wp-json/wp/v2/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setPost(response.data);

        // Fetch author name
        const authorId = response.data.author;
        const authorRes = await axios.get(`/wp-json/wp/v2/users/${authorId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setAuthorName(authorRes.data.name);
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("Post not found or access denied.");
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get(`/wp-json/wp/v2/users/me`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchPost();
    fetchUser();
  }, [id, authToken]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/wp-json/wp/v2/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("You are not allowed to delete this post.");
    }
  };

  if (!post) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1>{post.title.rendered}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />

      <p>
        <strong>Posted by:</strong> {authorName}
      </p>
      <p>
        <strong>Date:</strong> {new Date(post.date).toLocaleString()}
      </p>

      {user && user.id === post.author && (
        <>
          <Button variant="warning" as={Link} to={`/edit/${post.id}`}>
            Edit
          </Button>
          <Button variant="danger" className="ms-2" onClick={handleDelete}>
            Delete
          </Button>
        </>
      )}
    </Container>
  );
};

export default BlogPost;
