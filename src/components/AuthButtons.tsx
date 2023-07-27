import { Button } from "react-bootstrap";

interface AuthButtonsProps {
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
}

const AuthButtons = ({ onSignUpClicked, onLoginClicked }: AuthButtonsProps) => {


    return (
        // <p>Please log in to see your notes</p>
        <p>
            <Button onClick={onSignUpClicked}>Sign Up</Button>
            <Button style={{ marginLeft: "2rem" }} onClick={onLoginClicked}>Log In</Button>
        </p>
    );
}

export default AuthButtons;