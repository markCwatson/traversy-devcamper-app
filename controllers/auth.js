import { User } from "../models/user.js"
import { ErrorResponse } from '../utils/errorResponse.js'
import { asyncHandler } from '../middleware/async.js'

// @desc    Register a new user.
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    const { name, email, password, role } = req.body

    const user = await User.create({
        name,
        email,
        password,
        role
     })
    
     const token = user.getSignedJwt()

    res.status(200).json({
        success: true,
        token
    })
}

// @desc    Delete a user.
// @route   POST /api/v1/auth/:id
// @access  Private
const deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id)
    
    if (!user) {
        return next(new ErrorResponse('User not found!', 404))
    }

    await user.remove()
    
    res.status(200).json({
        success: true,
        date: {}
    })
}

export { registerUser, deleteUser }