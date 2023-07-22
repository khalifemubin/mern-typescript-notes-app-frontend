import { ConflictError, UnauthorisedError } from "../errors/http-errors";
import { Note } from "../models/note";
import { User } from "../models/user";

const BASE_URL = process.env.REACT_APP_BACKEND_URL + "/api";

async function fetchData(input: RequestInfo, init: RequestInit) {
    // if (localStorage.getItem('sess_user_id')) {
    //     init.headers = { 'Authorization': `Bearer ${localStorage.getItem('sess_user_id')}` }
    // }

    const controller = new AbortController()
    //10 seconds timeout
    setTimeout(() => controller.abort(), 10000);
    init.signal = controller.signal;

    const response = await fetch(input, init);

    if (response.ok) {
        return response
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;

        if (response.status === 401) {
            throw new UnauthorisedError(errorMessage);
        } else if (response.status === 409) {
            throw new ConflictError(errorMessage);
        } else {
            throw Error("Request failed with status: " + response.status + " , message: " + errorMessage);
        }
    }
}

export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData(BASE_URL + "/users", { method: "GET", credentials: "include" });
    return response.json();
}

export interface SignUpBody {
    username: string,
    email: string,
    password: string
}

export async function signUp(credentials: SignUpBody): Promise<User> {
    const response = await fetchData(BASE_URL + "/users/signup",
        {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

    return response.json();
}

export interface LoginBody {
    username: string,
    password: string
}

export async function login(credentials: LoginBody): Promise<User> {
    const response = await fetchData(BASE_URL + "/users/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            // "Access-Control-Allow-Credentials": "true",
            // "Allow-Control-Allow-Origin": "*",
        },
        // mode: 'no-cors', // 'cors' by default
        body: JSON.stringify(credentials),
        credentials: 'include', // Include cookies with the request
    });

    return response.json();
}

export async function logout() {
    await fetchData(BASE_URL + "/users/logout", {
        method: "POST",
        credentials: 'include',
    });
}


export async function fetchNotes(): Promise<Note[]> {
    const response = await fetchData(BASE_URL + "/notes", {
        method: "GET"
        , credentials: "include"
    });
    return response.json();
}

export interface NoteInput {
    title: string,
    text?: String
}

export async function createNote(note: NoteInput): Promise<Note> {
    const response = await fetchData(BASE_URL + "/notes",
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note),
            credentials: "include"
        });

    return response.json();
}

export async function deleteNote(noteId: string) {
    await fetchData(BASE_URL + "/notes/" + noteId, { method: "DELETE", credentials: "include" });
}

export async function updateNote(noteId: string, note: NoteInput): Promise<Note> {
    const response = await fetchData(BASE_URL + "/notes/" + noteId,
        {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(note),
            credentials: "include",
        });

    return response.json();
}