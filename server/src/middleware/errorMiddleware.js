
async function unknownURL(req, res, next) {
    const error = new Error(`cant find ${req.originalUrl} on this server`)
    error.statusCode=404
    next(error )
}

async function errorHandler(err, req, res, next) {

    err.statusCode=  err.statusCode || 500;
    err.status = err.status || 'error'

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
    
}

export {unknownURL, errorHandler}