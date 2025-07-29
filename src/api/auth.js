// src/api/auth.js
import { headers, bins } from "./client";

// Fetch all users
export const fetchUsers = async () => {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${bins.users}/latest`, {
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await res.json();
  return data.record || [];
};

// Save users list
const saveUsers = async (users) => {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${bins.users}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(users),
  });

  if (!res.ok) {
    throw new Error("Failed to save users");
  }
};

// Register a new user
export const registerUser = async (newUser) => {
  const users = await fetchUsers();

  const userExists = users.some(
    (u) =>
      u.username.toLowerCase() === newUser.username.toLowerCase() ||
      u.email.toLowerCase() === newUser.email.toLowerCase()
  );

  if (userExists) {
    throw new Error("Username or email already exists");
  }

  users.push({
    ...newUser,
    email: newUser.email.toLowerCase(),
    username: newUser.username,
    role: newUser.role || "user",
  });

  await saveUsers(users);
};

// Login a user
export const loginUser = async (username, password) => {
  const users = await fetchUsers();

  const user = users.find(
    (u) =>
      u.username.toLowerCase() === username.toLowerCase() &&
      u.password === password
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  return user;
};
