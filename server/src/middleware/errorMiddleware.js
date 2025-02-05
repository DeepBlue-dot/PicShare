import AppError from "../utils/appError.js";

async function unknownURL(req, res, next) {
    const error = new AppError(`cant find ${req.originalUrl} on this server`, 404)
    next(error )
}

async function errorHandler(err, req, res, next) {

    err.statusCode=  err.statusCode || 500;
    err.status = err.status || 'error'
    
    if(err.statusCode==500)console.log(err)

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
    
}

export {unknownURL, errorHandler}