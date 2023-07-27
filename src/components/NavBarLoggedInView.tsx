import { NavDropdown, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import * as NotesApi from "../network/notes_api";

interface NavBarLoggedInViewProps {
    user: User,
    onLogoutSuccess: () => void,
}

const NavBarLoggedInView = ({ user, onLogoutSuccess }: NavBarLoggedInViewProps) => {
    async function logout() {
        try {
            await NotesApi.logout();
            localStorage.clear();
            onLogoutSuccess();
        } catch (error) {
            console.error(error);
            alert(error);
        }
    };

    async function deleteAccount() {
        if (window.confirm("Are you sure you want to delete your account?")) {
            try {
                await NotesApi.deleteAccount();
                localStorage.clear();
                onLogoutSuccess();
            } catch (error) {
                console.error(error);
                alert(error);
            }
        }
    }

    return (
        <>
            <Navbar.Text className="me-2">
                Signed in as : {user.username}
            </Navbar.Text>
            <NavDropdown title="" id="logged-user-dropdown">
                <NavDropdown.Item onClick={logout}>Logout </NavDropdown.Item>
                <NavDropdown.Item onClick={deleteAccount} className="text-danger">Delete<br />Account </NavDropdown.Item>
                {/* <Button onClick={logout}>Logout </Button>
                <Button className="text-danger" onClick={deleteAccount}>Delete Account </Button> */}
            </NavDropdown>
        </>
    );
}

export default NavBarLoggedInView;