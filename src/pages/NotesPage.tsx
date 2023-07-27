import { /*Button ,*/ Container } from "react-bootstrap";
import NotesPageLoggedInView from "../components/NotesPageLoggedInView";
import NotesPageLoggedOutView from "../components/NotesPageLoggedOutView";
import { User } from "../models/user";
import styles from "../styles/NotesPage.module.css";

interface NotesPageProps {
    loggedInUser: User | null,
    onSignUpClick: () => void,
    onLoginClick: () => void,
}

const NotesPage = ({ loggedInUser, onSignUpClick, onLoginClick }: NotesPageProps) => {
    return (
        <Container className={styles.notesPage}>
            {/* {JSON.stringify(notes)} */}

            <>
                {loggedInUser
                    ? <NotesPageLoggedInView />
                    : <NotesPageLoggedOutView onSignUpClicked={onSignUpClick} onLoginClicked={onLoginClick} />
                }
            </>
        </Container>
    );
}

export default NotesPage;