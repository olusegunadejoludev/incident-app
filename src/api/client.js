// src/api/client.js
const JSONBIN_API_KEY = process.env.REACT_APP_JSONBIN_API_KEY;
const BIN_ID_USERS = process.env.REACT_APP_JSONBIN_BIN__USERS_ID;
const BIN_ID_POSTS = process.env.REACT_APP_JSONBIN_BIN__POSTS_ID;

export const Headers = {
  "Content-Type": "application/json",
  "X-Master-Key": JSONBIN_API_KEY,
};

export const Bins = {
  users: BIN_ID_USERS,
  posts: BIN_ID_POSTS,
};

//fetch("https://api.jsonbin.io/v3/b/6889c0d3ae596e708fbe0411", {
  //method: "PUT",
  //headers: {
    //"Content-Type": "application/json",
    //"X-Master-Key": JSONBIN_API_KEY,
 // },
  //body: JSON.stringify({ record: [] })
//})
  //.then(res => {
    //if (res.ok) {
      //console.log("✅ Key has write access");
    //} else {
      //console.log("❌ Key might not have write access", res.status);
   // }
  //})
 //.catch(err => console.error(err));
