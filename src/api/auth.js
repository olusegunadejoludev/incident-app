import { Headers } from "./client";
import { toast } from "react-toastify";

const BIN_USERS_URL_LATEST = "https://api.jsonbin.io/v3/b/68936ce1ae596e708fc3326f/latest";
const BIN_USERS_URL_PUT = "https://api.jsonbin.io/v3/b/68936ce1ae596e708fc3326f";

// ✅ Fetch all users from JSONBin
export const fetchUsers = async () => {
  try {
    const res = await fetch(BIN_USERS_URL_LATEST, {
      headers: Headers,
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.status}`);
    }

    const data = await res.json();
    return data.record?.users || data.users || [];
  } catch (error) {
    toast.error("❌ Failed to fetch users.");
    return [];
  }
};

// ✅ Save updated users list to JSONBin
const saveUsers = async (users) => {
  try {
    const res = await fetch(BIN_USERS_URL_PUT, {
      method: "PUT",
      headers: Headers,
      body: JSON.stringify({ users }),
    });

    if (!res.ok) {
      const responseText = await res.text();
      throw new Error(`❌ Save failed: ${res.status} ${responseText}`);
    }

    toast.success("✅ User registered successfully");
  } catch (error) {
    toast.error("❌ Error saving users.");
    throw error;
  }
};

// ✅ Register a new user
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

  const user = {
    id: Date.now().toString(),
    username: newUser.username.trim(),
    email: newUser.email.toLowerCase().trim(),
    password: newUser.password,
    role: newUser.role || "user",
  };

  users.push(user);
  await saveUsers(users);
};

// ✅ Login a user
export const loginUser = async (username, password) => {
  const users = await fetchUsers();
  const user = users.find(
    (u) =>
      (u.username.toLowerCase() === username.toLowerCase() ||
        u.email.toLowerCase() === username.toLowerCase()) &&
      u.password === password
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  toast.success(`✅ Welcome back, ${user.username}!`);
  return user;
};
