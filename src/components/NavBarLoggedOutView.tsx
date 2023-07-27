import AuthButtons from "./AuthButtons";

interface NavBarLoggedOutViewProps {
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
}

const NavBarLoggedOutView = ({ onSignUpClicked, onLoginClicked }: NavBarLoggedOutViewProps) => {
    return (
        <>
            <AuthButtons onSignUpClicked={onSignUpClicked} onLoginClicked={onLoginClicked} />
            {/* <Button id="navBarSignUpBtn" onClick={onSignUpClicked}>Sign Up</Button>
            <Button id="navBarLoginBtn" onClick={onLoginClicked}>Log In</Button> */}
        </>
    );
}

export default NavBarLoggedOutView;