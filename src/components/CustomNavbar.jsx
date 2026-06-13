import { useState } from 'react';
import { NavLink as ReactLink } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

const CustomNavbar = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
      <Navbar 
        className="app-navbar"
        dark
        expand="md"
      >
        <NavbarBrand className="brand-mark" tag={ReactLink} to="/">MyBlogs</NavbarBrand>
        <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink tag={ReactLink} to="/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={ReactLink} to="/services">Capabilities</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={ReactLink} to="/about">About</NavLink>
            </NavItem>
          </Nav>
          <Nav navbar>
            <NavItem>
              <NavLink tag={ReactLink} to="/login">Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-cta" tag={ReactLink} to="/signup">Create account</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
  )
};

export default CustomNavbar;
