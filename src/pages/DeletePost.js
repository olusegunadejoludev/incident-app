import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { deletePost } from "../api/posts";
import { AuthContext } from "../context/AuthContext";

const DeletePost = ({ postId, postAuthor }) => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const isAuthorized =
    auth.user &&
    (auth.user.email === postAuthor || auth.user.role === "admin");

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(postId, auth.user);
      alert("Post deleted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete post.");
    }
  };

  if (!isAuthorized) return null;

  return (
    <Button variant="danger" onClick={handleDelete}>
      Delete Post
    </Button>
  );
};

export default DeletePost;
