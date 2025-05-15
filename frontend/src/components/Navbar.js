// src/components/Navbar.js
import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Company Management System</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;