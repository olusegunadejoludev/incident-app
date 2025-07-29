// src/api/client.js
const JSONBIN_API_KEY = process.env.REACT_APP_JSONBIN_API_KEY;
const BIN_ID_USERS = process.env.REACT_APP_JSONBIN_BIN__USERS_ID;
const BIN_ID_POSTS = process.env.REACT_APP_JSONBIN_BIN__POSTS_ID;

export const headers = {
  "Content-Type": "application/json",
  "X-Master-Key": JSONBIN_API_KEY,
};

export const bins = {
  users: BIN_ID_USERS,
  posts: BIN_ID_POSTS,
};
