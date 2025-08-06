import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function About() {
  return (
    <Container className="text-center mx-4" id="about">
      <h1>About</h1>
      <p>Welcome to Incident App! 🎉</p>
      <p>
        Welcome to our incident reporting app! This is where we share important
        information about various incidents and updates in our community. Our
        goal is to provide a platform for users to report incidents, seek help,
        and stay informed.
      </p>
      <p>
        Feel free to explore our incident posts and don't hesitate to leave your
        comments and feedback. We appreciate your support and hope you enjoy
        your time here!
      </p>
      <p>
        Have questions or feedback? Feel free to reach out to us through the
        contact form provided on the <Link to="/contact">Contact</Link> page.
      </p>

      <h3>Thank You</h3>
      <p>Happy coding! 🚀</p>
    </Container>
  );
}

export default About;
