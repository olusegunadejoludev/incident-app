import React, { useState, useEffect } from "react";
import { Container, Card, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "../axiosConfig";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        const response = await axios.get("/wp-json/wp/v2/posts", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setError("Failed to fetch blog posts. Please try again later.");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const truncateContent = (htmlContent, maxLength) => {
    const text = htmlContent.replace(/<[^>]+>/g, ""); // strip HTML tags
    if (text.length <= maxLength) return text;
    const lastSpace = text.lastIndexOf(" ", maxLength);
    const cutAt = lastSpace !== -1 ? lastSpace : maxLength;
    return text.substring(0, cutAt) + "...";
  };

  return (
    <div>
      <Container>
        {loading ? (
          <div className="mt-4">
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
              <Card.Body>
                <Card.Title dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                <Card.Text>
                  <span>{truncateContent(post.content.rendered, 200)}</span>
                </Card.Text>
                <Link to={`/posts/${post.id}`} className="btn btn-primary">
                  Read More
                </Link>
              </Card.Body>
            </Card>
          ))}
      </Container>
    </div>
  );
};

export default Dashboard;
