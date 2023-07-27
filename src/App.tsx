// import logo from './logo.svg';
import NavBar from './components/NavBar';
import SignUpModal from './components/SignUpModal';
import LoginModal from './components/LoginModal';
import { useEffect, useState } from "react";
import { User } from "./models/user";
import * as NotesApi from "./network/notes_api";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NotesPage from './pages/NotesPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFoundPage from './pages/NotFoundPage';
import styles from "./styles/App.module.css";

function App() {
  // const [clickCount, setClickCount] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const [showSignupModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await NotesApi.getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {
        // console.log(error);
        // console.log("Operation error to determine if user is logged in or not");
      }
    }
    fetchLoggedInUser();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <NavBar
          loggedInUser={loggedInUser}
          onSignUpClick={() => setShowSignUpModal(true)}
          onLoginClick={() => setShowLoginModal(true)}
          onLogoutSuccess={() => setLoggedInUser(null)}
        />

        <Container className={styles.pageContainer}>
          <Routes>
            <Route path='/' element={<NotesPage loggedInUser={loggedInUser} onSignUpClick={() => setShowSignUpModal(true)}
              onLoginClick={() => setShowLoginModal(true)} />}></Route>
            <Route path='/privacy' element={<PrivacyPolicy />}></Route>
            <Route path='/*' element={<NotFoundPage />}></Route>
          </Routes>
        </Container>

        {showSignupModal &&
          <SignUpModal
            onDismiss={() => setShowSignUpModal(false)}
            onSignUpSuccess={(user) => {
              setLoggedInUser(user);
              setShowSignUpModal(false);
            }}
          />
        }

        {showLoginModal &&
          <LoginModal
            onDismiss={() => setShowLoginModal(false)}
            onLoginSuccess={(user) => {
              setLoggedInUser(user);
              setShowLoginModal(false);
            }}
          />
        }



      </div>
    </BrowserRouter>

    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <Button onClick={()=>setClickCount(clickCount+1)}>Clicked {clickCount} times</Button>
    //   </header>
    // </div>
  );
}

export default App;
