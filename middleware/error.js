import { ErrorResponse } from '../utils/errorResponse.js'

const errorHandler = (err, req, res, next) => {
  let error = { ...err }

  error.message = err.message
  
  // console.log(err)

  if (err.name === 'CastError') {
    error = new ErrorResponse(`Resource not found`, 404)
  }

  if (err.code === 11000) {
    error = new ErrorResponse('Duplicate field value entered', 400)
  }

  if (err.name === 'ValidationError') {
    const msg = Object.values(err.errors).map(val => val.message)
    error = new ErrorResponse(msg, 400)
  }

  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Server Error'
  })
}

export { errorHandler }