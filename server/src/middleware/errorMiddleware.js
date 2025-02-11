import AppError from "../utils/appError.js";

async function unknownURL(req, res, next) {
    const error = new AppError(`cant find ${req.originalUrl} on this server`, 404)
    next(error )
}

async function errorHandler(err, req, res, next) {

    if (typeof err === 'string') {
        err = new Error(err); // Convert string to an Error object
        err.statusCode = 500; // Or use an appropriate status code
      }
    
    err.statusCode=  err.statusCode || 500;
    err.status = err.status || 'error'
    
    if(err.statusCode==500)console.error(err)

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
    
}

export {unknownURL, errorHandler}