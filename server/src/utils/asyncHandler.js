function asyncHandler (fun) {
    return async (req, res, next) => {
        fun(req, res, next).catch(next)
    }
}

export default asyncHandler