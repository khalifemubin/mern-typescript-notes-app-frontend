import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpBody } from "../network/notes_api";
import { useState } from "react";
import * as NotesApi from "../network/notes_api";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import styleUtils from "../styles/utils.module.css";
import { ConflictError } from "../errors/http-errors";

interface SignUpModalProps {
    onDismiss: () => void,
    onSignUpSuccess: (user: User) => void
}

const SignUpModal = ({ onDismiss, onSignUpSuccess }: SignUpModalProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpBody>();
    const [signUpLoading, setSignUpLoading] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    async function onSubmit(credentials: SignUpBody) {
        try {
            setSignUpLoading(true);
            const newUser = await NotesApi.signUp(credentials);
            localStorage.setItem('sess_user_id', newUser.sessionID);
            // localStorage.setItem('sess_user_id', newUser._id);
            onSignUpSuccess(newUser);

            setShowAlert(true);
            setAlertVariant("success");
            setAlertMessage("Signup successfull!");
        } catch (error) {
            console.error(error);
            setShowAlert(true);
            setAlertVariant("danger");
            if (error instanceof ConflictError) {
                setAlertMessage(error.message);
            } else {
                setAlertMessage("Operation error! Unable to Signup");
            }
        } finally {
            setSignUpLoading(false);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
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
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Enter Email"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.email}
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
                    {signUpLoading && <Spinner animation='border' variant='primary' className="mt-4 d-flex justify-content-center" />}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={styleUtils.width100}
                    >
                        Sign Up
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default SignUpModal;