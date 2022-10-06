// @desc    Used to replace try/catch blocks in routes. 
//          asyncHandler receives a function (callback) and returns a function with params req, res, and next.
const asyncHandler = (callback) => (req, res, next) => { 
    Promise.resolve(callback(req, res, next)).catch(next)
}

export { asyncHandler }