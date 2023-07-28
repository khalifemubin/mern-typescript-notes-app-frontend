import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { ForgotPasswordBody } from "../network/notes_api";
import { useForm } from "react-hook-form";
import { Button, Form, Spinner } from "react-bootstrap";
import TextInputField from "../components/form/TextInputField";
import * as NotesApi from "../network/notes_api";


const ForgotPassword = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('sess_user_id') && localStorage.getItem('sess_user_id') !== undefined) {
            navigate("/")
        }
    }, [navigate]);

    const [sendForgotPasswordLoading, setSendForgotPasswordLoading] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordBody>();

    async function onSubmit(email: ForgotPasswordBody) {
        try {
            setSendForgotPasswordLoading(true);
            await NotesApi.requestPasswordReset(email);

            //show success message
        } catch (error) {
            console.error(error);
            //show error message

        } finally {
            setSendForgotPasswordLoading(false);
        }
    }


    return (
        <div>
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
        </div>
    );
}

export default ForgotPassword;