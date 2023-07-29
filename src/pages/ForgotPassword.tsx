import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { ForgotPasswordBody } from "../network/notes_api";
import { useForm } from "react-hook-form";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import TextInputField from "../components/form/TextInputField";
import * as NotesApi from "../network/notes_api";
import { NotFoundError } from "../errors/http-errors";
import { User } from "../models/user";

interface ForgotPasswordProps {
    loggedInUser: User | null,
}

const ForgotPassword = ({ loggedInUser }: ForgotPasswordProps) => {
    const navigate = useNavigate();
    // const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(true);

    useEffect(() => {
        console.log(loggedInUser);
        // if (localStorage.getItem('sess_user_id') && localStorage.getItem('sess_user_id') !== undefined) {
        if (loggedInUser) {
            navigate("/")
        }

        // if (localStorage.getItem("forgot_password_timeout") && localStorage.getItem("forgot_password_timeout") !== undefined) {
        //     let timeout_remaining = localStorage.getItem("forgot_password_timeout");

        //     if (timeout_remaining !== null) {
        //         if (Number((Date.now() - JSON.parse(timeout_remaining)) / 1000) < (15 * 60)) {
        //             //if time elapsed is less than 15 minutes then do not show the form
        //             setShowForgotPasswordForm(false);
        //         }
        //     }

        // }

    }, [loggedInUser, navigate]);

    const [sendForgotPasswordLoading, setSendForgotPasswordLoading] = useState(false);

    // const FORGOT_PASSWORD_MODULE_MESSAGE_TIMEOUT = 2000;

    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordBody>();

    async function onSubmit(email: ForgotPasswordBody) {
        setShowAlert(false);
        setAlertVariant("");
        setAlertMessage("");
        try {
            setSendForgotPasswordLoading(true);
            await NotesApi.requestPasswordReset(email);

            setShowAlert(true);
            setAlertVariant("success");
            setAlertMessage("Password reset link sent to your email succuessfully!");
            // localStorage.setItem('forgot_password_timeout', JSON.stringify(Date.now()));
            // setShowForgotPasswordForm(false);

            //show success message
            // setTimeout(() => {
            // setShowAlert(false);
            // setAlertVariant("");
            // setAlertMessage("");
            // }, FORGOT_PASSWORD_MODULE_MESSAGE_TIMEOUT);
        } catch (error) {
            // console.error(error);
            //show error message

            setShowAlert(true);
            setAlertVariant("danger");

            if (error instanceof NotFoundError) {
                console.log(error.message);
                setAlertMessage(error.message);
            } else {
                // setAlertMessage("Operation Error. Please try again later");
                setAlertMessage("Operation Error! Could not sent password reset link to your email");
            }

        } finally {
            setSendForgotPasswordLoading(false);
        }
    }


    return (
        <div>
            {showAlert &&
                <Alert variant={alertVariant} dismissible={false}>{alertMessage}</Alert>
            }

            {/* {showForgotPasswordForm ? */}
            <Form onSubmit={handleSubmit(onSubmit)}>
                <TextInputField
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Enter your Email"
                    register={register}
                    registerOptions={{ required: "Required", pattern: { value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, message: "Please Enter Valid Email" } }}
                    error={errors.email}
                // error={(errors.email?.type === "pattern") ? <p>{errors.email.message}</p> : <p>Email is required</p>}

                />
                {sendForgotPasswordLoading && <Spinner animation='border' variant='primary' className="mt-4 d-flex justify-content-center" />}
                <div className="mt-4 d-flex justify-content-center">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isSubmitting}
                    >
                        Send Password Reset
                    </Button>
                </div>
            </Form>
            {/* : <p className="txt-warning">Cannot reset password for 15 minutes between requests</p>
            } */}
        </div>
    );
}

export default ForgotPassword;