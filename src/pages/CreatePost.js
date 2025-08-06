import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { createPost } from "../api/posts";

const CreatePost = () => {
  const [post, setPost] = useState({
    title: "",
    content: "",
    category: "", // default category
  });
  const [imageFile, setImageFile] = useState(null);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 2 * 1024 * 1024) {
      setImageFile(file);
    } else {
      alert("Image is too large. Please upload a file smaller than 2MB.");
      setImageFile(null);
    }
  };

  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const ratio = img.width / img.height;
          canvas.width = maxWidth;
          canvas.height = maxWidth / ratio;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageData = null;
      if (imageFile) {
        try {
          imageData = await compressImage(imageFile);
        } catch {
          console.warn("Image compression failed.");
        }
      }

      const newPost = {
        id: crypto.randomUUID(),
        title: post.title.trim(),
        content: post.content.trim(),
        category: post.category, // include selected category
        image: imageData || null,
        author: auth.user?.username || auth.user?.email || "anonymous",
        createdAt: new Date().toISOString(),
      };

      await createPost(newPost);
      alert("Post created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Create post error:", error);
      alert("Failed to create post.");
    }
  };

  return (
    <Container className="mt-5">
      <h2>Create New Post</h2>
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
            rows={5}
            name="content"
            value={post.content}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Incident Category</Form.Label>
            <Form.Select
              name="category"
              value={post.category}
              onChange={handleChange}
              required
            >
          <option value="">Select a category</option>
          <option value="Crime">Crime</option>
          <option value="Accident">Accident</option>
          <option value="Emergency">Emergency</option>
          <option value="Public Disturbance">Public Disturbance</option>
          <option value="Missing / Found">Missing / Found</option>
          <option value="Suspicious Activity">Suspicious Activity</option>
          <option value="Environmental Hazard">Environmental Hazard</option>
          <option value="Harassment / Abuse">Harassment / Abuse</option>
          <option value="Other">Other</option>
            </Form.Select>
        </Form.Group>


        <Form.Group className="mb-3" controlId="imageUpload">
          <Form.Label>Upload Image (optional)</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
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
