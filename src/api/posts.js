// src/api/posts.js
import { Headers } from "./client";

// Get all posts
export const getAllPosts = async () => {
  const res = await fetch('https://api.jsonbin.io/v3/b/6889c10cae596e708fbe044c/latest', {
    headers: Headers,
  });
  const json = await res.json();
  return json.record || [];
};

// Get a single post by ID
export const getPostById = async (id) => {
  const posts = await getAllPosts();
  const post = posts.find((p) => p.id === id);
  if (!post) throw new Error("Post not found");
  return post;
};

// Save updated posts array to JSONBin
const savePosts = async (posts) => {
  await fetch('https://api.jsonbin.io/v3/b/6889c10cae596e708fbe044c', {
    method: "PUT",
    headers: Headers,
    body: JSON.stringify({ record: posts }),
  });
};

// Create a new post
export const createPost = async (post) => {
  const posts = await getAllPosts();
  const newPost = {
    ...post,
    id: Date.now().toString(), // Unique ID
    createdAt: new Date().toISOString(),
  };
  posts.push(newPost);
  await savePosts(posts);
  return newPost;
};

// Edit an existing post
export const editPost = async (updatedPost, user) => {
  const posts = await getAllPosts();
  const index = posts.findIndex((p) => p.id === updatedPost.id);

  if (index === -1) throw new Error("Post not found");

  const post = posts[index];
  const isAuthor =
    post.author === user?.username || post.author === user?.email;

  if (!isAuthor) throw new Error("Not authorized to edit this post");

  posts[index] = {
    ...post,
    ...updatedPost,
    updatedAt: new Date().toISOString(),
  };

  await savePosts(posts);
  return posts[index];
};

// Delete a post
export const deletePost = async (postId, user) => {
  let posts = await getAllPosts();
  const post = posts.find((p) => p.id === postId);

  if (!post) throw new Error("Post not found");

  const isAuthor =
    post.author === user?.username || post.author === user?.email;
  const isAdmin = user?.role === "admin";

  if (!isAuthor && !isAdmin)
    throw new Error("Not authorized to delete this post");

  posts = posts.filter((p) => p.id !== postId);
  await savePosts(posts);
};