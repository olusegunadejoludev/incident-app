// Importing necessary components
import { Container } from "react-bootstrap"; // Bootstrap container for layout
import { Link } from "react-router-dom"; // React Router's Link for navigation

// Homepage component definition
const Homepage = () => {
  return (
    <div>
      {/* Bootstrap Container for centering content */}
      <Container className="text-center mt-5">
        {/* Main heading */}
        <h1 className="display-4 fw-bold">Welcome to Blog App</h1>

        {/* Subheading with navigation links */}
        <p className="lead mt-3">
        <h5>
          Please kindly <Link to="/login">Login</Link> or{" "}
          <Link to="/register">Sign up</Link> to continue.
        </h5>
        </p>
      </Container>
    </div>
  );
};

// Exporting the Homepage component as default
export default Homepage;
