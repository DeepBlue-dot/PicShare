class AppError extends Error {
    constructor(message, statusCode) {
        super(message)

        this.statusCode = statusCode;
        this.status = 
        Error.captureStackTrace(this, this.constructor);

    }
}