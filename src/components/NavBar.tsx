import { Container, Navbar, Nav } from "react-bootstrap";
import { User } from "../models/user";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import { Link } from "react-router-dom";

interface NavBarProps {
    loggedInUser: User | null,
    onSignUpClick: () => void,
    onLoginClick: () => void,
    onLogoutSuccess: () => void
}

const NavBar = ({ loggedInUser, onSignUpClick, onLoginClick, onLogoutSuccess }: NavBarProps) => {
    return (
        <Navbar bg="primary" variant="dark" expand="sm" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    MERN Notes App
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav>
                        {/* Cannot use href as it will refresh the page and make the user undefined for few seconds */}
                        {/* <Nav.Link href="/privacy"> */}
                        <Nav.Link as={Link} to="/privacy">
                            {/* <Link to="/privacy">Privacy</Link> */}
                            Privacy
                        </Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        {loggedInUser
                            ?
                            <NavBarLoggedInView user={loggedInUser} onLogoutSuccess={onLogoutSuccess} />
                            :
                            <NavBarLoggedOutView onSignUpClicked={onSignUpClick} onLoginClicked={onLoginClick} />
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;