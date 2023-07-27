import AuthButtons from "./AuthButtons";

interface NotesPageLoggedOutViewProps {
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
}

const NotesPageLoggedOutView = ({ onSignUpClicked, onLoginClicked }: NotesPageLoggedOutViewProps) => {


    return (
        // <p>Please log in to see your notes</p>
        <>
            <AuthButtons onSignUpClicked={onSignUpClicked} onLoginClicked={onLoginClicked} />
        </>
    );
}

export default NotesPageLoggedOutView;