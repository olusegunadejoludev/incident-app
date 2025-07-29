// Import global styles
import "./assets/css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// React and routing
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

// Context
import { AuthContext } from "./context/AuthContext";

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
import DeletePost from "./pages/DeletePost";

// Protected route wrapper
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });

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
              <Route path="/delete/:id" element={<DeletePost />} />
            </Route>

            {/* Public post route */}
            <Route path="/posts/:id" element={<BlogPost />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
