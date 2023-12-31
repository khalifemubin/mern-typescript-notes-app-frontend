import { User } from "../models/user";
import { LoginBody } from "../network/notes_api";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import { useState } from "react";
import * as NotesApi from "../network/notes_api";
import TextInputField from "./form/TextInputField";
import styleUtils from "../styles/utils.module.css";
import { useForm } from "react-hook-form";
import { UnauthorisedError } from "../errors/http-errors";

interface loginModalProps {
    onDismiss: () => void,
    onLoginSuccess: (user: User) => void,
}

const LoginModal = ({ onDismiss, onLoginSuccess }: loginModalProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginBody>();

    const [loginLoading, setLoginLoading] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("");
    const [alertMessage, setAlertMessage] = useState("");


    async function onSubmit(credentials: LoginBody) {
        try {
            setLoginLoading(true);
            const user = await NotesApi.login(credentials);
            localStorage.setItem('sess_user_id', user.sessionID);
            // localStorage.setItem('sess_user_id', user._id);

            onLoginSuccess(user);

            setShowAlert(true);
            setAlertVariant("success");
            setAlertMessage("Login successfull");
        } catch (error) {
            console.error(error);
            setShowAlert(true);
            setAlertVariant("danger");

            if (error instanceof UnauthorisedError) {
                setAlertMessage(error.message);
            } else {
                // setAlertMessage("Operation Error. Please try again later");
                setAlertMessage("Invaid Credentials!");
            }
        } finally {
            setLoginLoading(false);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>Log In</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {showAlert &&
                    <Alert variant={alertVariant} dismissible>{alertMessage}</Alert>
                }
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="username"
                        label="Username"
                        type="text"
                        placeholder="Enter Username"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.username}
                    />
                    <TextInputField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Enter Password"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.password}
                    />
                    {loginLoading && <Spinner animation='border' variant='primary' className="mt-4 d-flex justify-content-center" />}
                    <Button
                        type="submit"
                        className={styleUtils.width100}
                        disabled={isSubmitting}
                    >
                        Log In
                    </Button>
                    <a href="/forgot-password" className="mt-4 d-flex justify-content-center">Forgot Password?</a>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default LoginModal;