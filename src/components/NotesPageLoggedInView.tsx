import styleUtils from "../styles/utils.module.css";
import styles from "../styles/NotesPage.module.css";
import AddEditNoteDialog from '../components/AddEditNoteDialog';
import { FaPlus } from "react-icons/fa"
import { Button, Spinner, Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from 'react';
import { Note as NoteModel } from '../models/note';
import * as NotesApi from "../network/notes_api";
import Note from '../components/Note';

const NotesPageLoggedInView = () => {
    const [notes, setNotes] = useState<NoteModel[]>([]);

    const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);
    const [notesLoading, setNotesLoading] = useState(true);
    const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);

    useEffect(() => {
        async function loadNotes() {
            try {
                setNotesLoading(true);
                setShowNotesLoadingError(false);
                const notes = await NotesApi.fetchNotes();

                setNotes(notes);
            } catch (error) {
                console.error(error);
                // alert(`Error occured while trying to fetch notes. ${error}`)
                setShowNotesLoadingError(true);
            } finally {
                setNotesLoading(false);
            }

        }

        loadNotes();

    }, []);

    async function deleteNote(note: NoteModel) {
        try {
            await NotesApi.deleteNote(note.id);
            setNotes(notes.filter(existingNote => existingNote.id !== note.id))
            // await NotesApi.deleteNote(note._id);
            // setNotes(notes.filter(existingNote => existingNote._id !== note._id))
        } catch (error) {
            console.error(error);
        }
    }

    const notesGrid = <Row xs={1} md={2} lg={3} className={`g-4 ${styles.notesGrid}`}>
        {notes?.map(note => (
            <Col key={note.id}>
                {/* <Col key={note._id}> */}
                <Note note={note} className={styles.note} onDeleteNoteClicked={deleteNote} onNoteClicked={setNoteToEdit} />
            </Col>
        ))}
    </Row>

    return (
        <>
            <Button onClick={() => setShowAddEditNoteDialog(true)} className={`mb-4 mt-3 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}>
                <FaPlus />
                Add Note
            </Button>

            {notesLoading && <Spinner animation='border' variant='primary' />}
            {showNotesLoadingError && <p className='text-danger'>Something went wrong! Please refresh the page</p>}
            {!notesLoading && !showNotesLoadingError &&
                <>
                    {notes?.length > 0
                        ? notesGrid
                        :
                        <p>You don't have any notes yet</p>
                    }
                </>
            }

            {showAddEditNoteDialog &&
                <AddEditNoteDialog onDismiss={() => { setShowAddEditNoteDialog(false); setNoteToEdit(null); }}
                    onNoteSaved={(newNote) => {
                        setNotes([...notes, newNote]);
                        setShowAddEditNoteDialog(false);
                    }}
                />
            }

            {noteToEdit &&
                <AddEditNoteDialog
                    noteToEdit={noteToEdit}
                    onDismiss={() => { setShowAddEditNoteDialog(false); setNoteToEdit(null); }}
                    onNoteSaved={(updatedNote) => {
                        setNotes(notes.map(existingNote => existingNote.id === updatedNote.id ? updatedNote : existingNote));
                        // setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote));
                        setNoteToEdit(null);
                    }}
                />
            }
        </>
    );
}

export default NotesPageLoggedInView;