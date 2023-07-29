class HttpError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

/**
 * Status Code: 401
 */
export class UnauthorisedError extends HttpError { }

/**
 * Status Code: 409
 */
export class ConflictError extends HttpError { }

/**
 * Status Code: 404
 */
export class NotFoundError extends HttpError { }