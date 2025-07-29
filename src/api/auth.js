// src/api/auth.js
import { headers, bins } from "./client";

// Get users
export const fetchUsers = async () => {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${bins.users}/latest`, {
    headers,
  });
  const json = await res.json();
  return json.record || [];
};

// Save users
const saveUsers = async (users) => {
  await fetch(`https://api.jsonbin.io/v3/b/${bins.users}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(users),
  });
};

// Register
export const registerUser = async (user) => {
  const users = await fetchUsers();
  const exists = users.find((u) => u.username === user.username);
  if (exists) throw new Error("Username already exists");
  users.push(user);
  await saveUsers(users);
};

// Login
export const loginUser = async (username, password) => {
  const users = await fetchUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) throw new Error("Invalid credentials");
  return user;
};
