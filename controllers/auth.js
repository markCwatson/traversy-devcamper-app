import { User } from "../models/user.js"
import { ErrorResponse } from '../utils/errorResponse.js'
import { asyncHandler } from '../middleware/async.js'
import { sendToken } from "../utils/sendToken.js"

// @desc    Register a new user.
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    const { name, email, password, role } = req.body

    const checkUser = await User.find({ email })

    if (checkUser.length > 0) {
        return next(new Error('Email already in use!', 400))
    }

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

// @desc    Login user.
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new Error('Include email and password!', 400))
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new Error('Invalid credentials!', 401))
    }

    const isMatch = await user.checkPassword(password)

    if (!isMatch) {
        return next(new Error('Invalid credentials!', 401))
    }

    sendToken(user, 200, res)
}

// @desc    Get current loged-in user.
// @route   GET /api/v1/auth/me
// @access  Public
const getCurrentUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })
})

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

export {
    registerUser,
    deleteUser,
    loginUser,
    getCurrentUser
}