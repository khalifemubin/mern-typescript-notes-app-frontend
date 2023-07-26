import { Button, Form, Modal, Alert } from "react-bootstrap";
import { Note } from "../models/note";
import { useForm } from "react-hook-form";
import { NoteInput } from "../network/notes_api";
import { useState } from "react";
import * as NotesApi from "../network/notes_api";
import TextInputField from "./form/TextInputField";

interface AddEditNoteDialogProps {
    noteToEdit?: Note,
    onDismiss: () => void,
    onNoteSaved: (note: Note) => void,
}

const AddEditNoteDialog = ({ noteToEdit, onDismiss, onNoteSaved }: AddEditNoteDialogProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NoteInput>({
        defaultValues: {
            title: noteToEdit?.title || "",
            text: noteToEdit?.text || ""
        }
    });
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    async function onSubmit(input: NoteInput) {
        try {
            let noteResponse: Note;

            if (noteToEdit) {
                noteResponse = await NotesApi.updateNote(noteToEdit.id, input);
                // noteResponse = await NotesApi.updateNote(noteToEdit._id, input);
            } else {
                noteResponse = await NotesApi.createNote(input);
            }

            console.log(noteResponse);

            onNoteSaved(noteResponse);
            setShowAlert(true);
            setAlertVariant("success");
            setAlertMessage("Note saved successfully");
        } catch (error) {
            console.error(error);
            setShowAlert(true);
            setAlertVariant("danger");
            setAlertMessage("Operation error! Your note could not be saved");
            // setAlertMessage(error as string);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>{noteToEdit ? "Edit Note" : "Add Note"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {showAlert &&
                    <Alert variant={alertVariant} dismissible>{alertMessage}</Alert>
                }

                <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="title"
                        label="title"
                        type="text"
                        placeholder="Enter Title"
                        register={register}
                        registerOptions={{ required: "This field is Required" }}
                        error={errors.title}
                    />

                    <TextInputField
                        name="text"
                        label="text"
                        as="textarea"
                        rows={5}
                        placeholder="Enter Text"
                        register={register}
                    />
                    {/*<Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter Title" 
                        isInvalid={!!errors.title}
                        {...register("title", {required: "This field is Required"})} 
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Text</Form.Label>
                        <Form.Control as="textarea" placeholder="Enter Text" rows={5}
                        {...register("text")} 
                        />
                    </Form.Group>*/}

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button type="submit" form="addEditNoteForm" disabled={isSubmitting}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddEditNoteDialog;