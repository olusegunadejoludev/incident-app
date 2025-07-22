// Import global styles
import "./assets/css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// React and routing
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Context and utilities
import { AuthContext } from "./context/AuthContext";
import setAuthToken from "./utils/setAuthToken";
import axios from "./axiosConfig";

// Layout Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import BlogPost from "./pages/BlogPost";

// Protected route wrapper
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) return;

      try {
        setAuthToken(token);

        const res = await axios.get("/wp/v2/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAuth({
          isAuthenticated: true,
          user: res.data,
        });
      } catch (err) {
        console.error("Token expired or invalid:", err);
        localStorage.removeItem("authToken");
        setAuth({
          isAuthenticated: false,
          user: null,
        });
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/edit/:id" element={<EditPost />} />
            </Route>

            {/* Public route */}
            <Route path="/posts/:id" element={<BlogPost />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
