import { User } from "../models/user.js"
import { ErrorResponse } from '../utils/errorResponse.js'
import { asyncHandler } from '../middleware/async.js'

// @desc    Register a new user.
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    res.status(200).json({
        success: true
    })
}

export { registerUser }