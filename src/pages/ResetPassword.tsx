import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import { ResetPasswordBody } from "../network/notes_api";
import { useForm } from "react-hook-form";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import TextInputField from "../components/form/TextInputField";
import * as NotesApi from "../network/notes_api";
import { NotFoundError } from "../errors/http-errors";
import { User } from "../models/user";

interface ResetPasswordProps {
    loggedInUser: User | null,
}

const ResetPassword = ({ loggedInUser }: ResetPasswordProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        // if (localStorage.getItem('sess_user_id') && localStorage.getItem('sess_user_id') !== undefined) {
        console.log(loggedInUser);
        if (loggedInUser) {
            navigate("/");
        }

    }, [loggedInUser, navigate]);

    const params = useParams();
    const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
    const [showResetPasswordForm, setShowResetPasswordForm] = useState(true);

    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const { register, getValues, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordBody>();

    async function onSubmit(formBody: ResetPasswordBody) {
        setShowAlert(false);
        setAlertVariant("");
        setAlertMessage("");
        try {
            setResetPasswordLoading(true);
            await NotesApi.resetPassword({
                new_password: formBody.new_password,
                confirmNewPassword: formBody.confirmNewPassword,
                actionToken: params.token!
            });

            setShowResetPasswordForm(false);
            setShowAlert(true);
            setAlertVariant("success");
            setAlertMessage("Password changed successfully!You can now try to login with new password");
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
            setResetPasswordLoading(false);
        }
    }


    return (
        <div>
            {showAlert &&
                <Alert variant={alertVariant} dismissible={false}>{alertMessage}</Alert>
            }

            {showResetPasswordForm &&
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="new_password"
                        label="New Password"
                        type="password"
                        placeholder="Enter New Password"
                        register={register}
                        registerOptions={{
                            required: "Required",
                            minLength: {
                                value: 6,
                                message: "Minumum 6 characters required"
                            },
                            maxLength: {
                                value: 20,
                                message: "Maximum 20 characters required"
                            },
                        }}
                        error={errors.new_password}
                    // error={(errors.email?.type === "pattern") ? <p>{errors.email.message}</p> : <p>Email is required</p>}
                    />
                    <TextInputField
                        name="confirmNewPassword"
                        label="Confirm New Password"
                        type="password"
                        placeholder="Confirm New Password"
                        register={register}
                        registerOptions={{
                            required: "Required",
                            minLength: {
                                value: 6,
                                message: "Minumum 6 characters required"
                            },
                            maxLength: {
                                value: 20,
                                message: "Maximum 20 characters required"
                            },
                            validate: (value) => {
                                const { new_password } = getValues();
                                // console.log(new_password, value);
                                return new_password === value || "Passwords dont't match!";
                            }
                        }}
                        error={errors.confirmNewPassword}
                    // error={(errors.email?.type === "pattern") ? <p>{errors.email.message}</p> : <p>Email is required</p>}
                    />
                    {resetPasswordLoading && <Spinner animation='border' variant='primary' className="mt-4 d-flex justify-content-center" />}
                    <div className="mt-4 d-flex justify-content-center">
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={isSubmitting}
                        >
                            Reset Password
                        </Button>
                    </div>
                </Form>
            }
        </div>
    );
}

export default ResetPassword;