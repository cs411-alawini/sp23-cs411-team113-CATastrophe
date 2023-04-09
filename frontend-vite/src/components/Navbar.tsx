import { ReactNode } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

interface MyNavbarProps {
  children: ReactNode;
  title: string;
  titleLink: string;
}

function MyNavbar({ children, title, titleLink }: MyNavbarProps) {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href={titleLink}>{title}</Navbar.Brand>
        <div className="d-flex justify-content-end w-100">
          <Nav>{children}</Nav>
        </div>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
