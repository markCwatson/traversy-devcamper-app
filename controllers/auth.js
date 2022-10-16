import crypto from 'crypto'

import { User } from "../models/user.js"
import { ErrorResponse } from '../utils/errorResponse.js'
import { asyncHandler } from '../middleware/async.js'
import { sendToken } from "../utils/sendToken.js"
import { sendEmail } from "../utils/sendEmail.js"

// @desc    Register a new user.
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body

    const checkUser = await User.find({ email })

    if (checkUser.length > 0) {
        return next(new ErrorResponse('Email already in use!', 400))
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
})

// @desc    Login user.
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorResponse('Include email and password!', 400))
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorResponse('Invalid credentials!', 401))
    }

    const isMatch = await user.checkPassword(password)

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials!', 401))
    }

    sendToken(user, 200, res)
})

// @desc    Logout user.
// @route   GET /api/v1/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        data: {}
    })
})

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

// @desc    Forgot password.
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    const resetToken = user.getResetPasswordToken()
    await user.save()

    const url = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`
    const msg = `Please make a PUT request to: \n\n ${url}`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message: msg
        })

        res.status(200).json({
            success: true,
            data: 'Email sent!'
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        
        await user.save()
        return next(new ErrorResponse('Could not send email!', 500))
    }
})

// @desc   Reset password.
// @route   PUT /api/v1/auth/resetpassword/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex')
    
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorResponse('Invalid token!', 400))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    sendToken(user, 200, res)
})

// @desc    Delete a user.
// @route   POST /api/v1/auth/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    
    if (!user) {
        return next(new ErrorResponse('User not found!', 404))
    }

    await user.remove()
    
    res.status(200).json({
        success: true,
        date: {}
    })
})

export {
    registerUser,
    deleteUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    forgotPassword,
    resetPassword
}