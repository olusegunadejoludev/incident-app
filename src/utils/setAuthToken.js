// Function to set/remove the authenticated user in localStorage
const setAuthToken = (user) => {
  if (user) {
    localStorage.setItem("authUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("authUser");
  }
};

export default setAuthToken;
