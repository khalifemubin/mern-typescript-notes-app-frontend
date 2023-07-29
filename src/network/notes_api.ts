import axios, { AxiosError } from 'axios';
import { ConflictError, UnauthorisedError, NotFoundError } from "../errors/http-errors";
import { Note } from "../models/note";
import { User } from "../models/user";

const BASE_URL = process.env.REACT_APP_BACKEND_URL + "/api";

const API = axios.create({ baseURL: BASE_URL })

API.interceptors.request.use((req) => {
    if (localStorage.getItem('sess_user_id') && localStorage.getItem('sess_user_id') !== undefined) {
        req.headers.authorization = `Bearer ${localStorage.getItem('sess_user_id')}`;
        req.withCredentials = true;
    }

    // req.timeout = 5000;

    return req;
})

type GenericError = {
    error: string
}

async function fetchData<T>(url: string, method: String, requestData: Object): Promise<T> {
    // console.log("Inside fetchData");
    let response;

    try {
        switch (method) {
            case "GET":
                response = await API.get<T>(url).catch((err) => { throw (err) });
                break;
            case "POST":
                response = await API.post<T>(url, requestData).catch((err) => { throw (err) });
                break;
            case "DELETE":
                response = await API.delete<T>(url, requestData).catch((err) => { throw (err) });
                break;
            case "PATCH":
                response = await API.patch<T>(url, requestData).catch((err) => { throw (err) });
                break;
        }

        // console.log(response)
        // console.log("end of fetchData");
        return response?.data as T;
    } catch (error) {
        const err = error as AxiosError;
        const errorMessage = (err.response?.data as GenericError).error;// response?.data as string;

        // console.log("Start Error body of fetchData ");
        // console.log(err);
        // // console.log(errorMessage);
        // console.log("End Error body of fetchData ");

        if (err.response?.status === 401) {
            throw new UnauthorisedError(errorMessage);
        } else if (err.response?.status === 409) {
            throw new ConflictError(errorMessage);
        } else if (err.response?.status === 404) {
            throw new NotFoundError(errorMessage);
        } else {
            throw Error("Request failed with status: " + err.response?.status + " , message: " + errorMessage);
        }
    }
}

export async function getLoggedInUser(): Promise<User> {
    // let resBodyType:User;
    const response = await fetchData<User>(BASE_URL + "/users", "GET", {});
    return response;

    // try {
    //     const response = await API.get<User>(`${BASE_URL}/users`);
    //     return response.data;
    // } catch (error) {
    //     const err = error as AxiosError
    //     const errorMessage = err.response?.data as string;

    //     if (err.status === 401) {
    //         throw new UnauthorisedError(errorMessage);
    //     } else if (err.status === 409) {
    //         throw new ConflictError(errorMessage);
    //     } else {
    //         throw Error("Request failed with status: " + err.status + " , message: " + errorMessage);
    //     }
    // }
}

export interface SignUpBody {
    username: string,
    email: string,
    password: string
}

export async function signUp(credentials: SignUpBody): Promise<User> {
    // const response = await API.post(BASE_URL + "/users/signup", credentials, { headers: { "Content-Type": "application/json" } });
    // return response.data;
    const response = await fetchData<User>(BASE_URL + "/users/signup", "POST", credentials);
    console.log("signUp response ", response);
    return response;
}

export interface LoginBody {
    username: string,
    password: string
}

export async function login(credentials: LoginBody): Promise<User> {
    // const response = await API.post(BASE_URL + "/users/login", credentials, { headers: { "Content-Type": "application/json" } });
    // return response.data;
    const response = await fetchData<User>(BASE_URL + "/users/login", "POST", credentials);
    return response;
}

export async function logout() {
    // await API.post(BASE_URL + "/users/logout", {}, { headers: { "Content-Type": "application/json" } });
    await fetchData(BASE_URL + "/users/logout", "POST", {});
}

export async function fetchNotes(): Promise<Note[]> {
    // const response = await API.get(BASE_URL + "/notes");
    // return response.data;
    const response = await fetchData<Note[]>(BASE_URL + "/notes", "GET", {});

    console.log("Inisde fetchNotes");
    console.log(response)
    console.log("Inisde fetchNotes");


    return response;
}

export interface NoteInput {
    title: string,
    text?: String
}

export async function createNote(note: NoteInput): Promise<Note> {
    // const response = await API.post(BASE_URL + "/notes", note, { headers: { "Content-Type": "application/json" } });
    // return response.data;
    const response = await fetchData<Note>(BASE_URL + "/notes", "POST", note);
    return response;
}

export async function deleteNote(noteId: number) {
    // export async function deleteNote(noteId: string) {
    // await API.delete(BASE_URL + "/notes/" + noteId);
    await fetchData(BASE_URL + "/notes/" + noteId, "DELETE", {});
}

export async function updateNote(noteId: number, note: NoteInput): Promise<Note> {
    // export async function updateNote(noteId: string, note: NoteInput): Promise<Note> {
    // const response = await API.patch(BASE_URL + "/notes/" + noteId, note, { headers: { "Content-Type": "application/json" } });
    // return response.data;
    const response = await fetchData<Note>(BASE_URL + "/notes/" + noteId, "PATCH", note);
    return response;
}

export async function deleteAccount(): Promise<Note> {
    // export async function updateNote(noteId: string, note: NoteInput): Promise<Note> {
    // const response = await API.patch(BASE_URL + "/notes/" + noteId, note, { headers: { "Content-Type": "application/json" } });
    // return response.data;
    const response = await fetchData<Note>(BASE_URL + "/users/delete-account", "POST", {});
    return response;
}

export interface ForgotPasswordBody {
    email: string
}

export async function requestPasswordReset(email: ForgotPasswordBody) {
    const response = await fetchData<Note>(BASE_URL + "/users/request-password-reset", "POST", email);
    return response;
}

export interface ResetPasswordBody {
    new_password: string,
    confirmNewPassword: string,
    actionToken: string
}

export async function resetPassword(requestBody: ResetPasswordBody) {
    const response = await fetchData<Note>(BASE_URL + "/users/reset-password", "POST", requestBody);
    return response;
}
