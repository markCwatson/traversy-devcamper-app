import jwt from 'jsonwebtoken'
import { asyncHandler } from './async.js'
import { User } from "../models/user.js"
import { ErrorResponse } from '../utils/errorResponse.js'


const protect = asyncHandler(async (req, res, next) => {
    let token
    const { authorization } = req.headers

    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1]
    }

    if (!token) {
        return next(new ErrorResponse('Not authorized!', 401))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id)
        next()
    } catch (error) {
        return next(new ErrorResponse('Not authorized!', 401))
    }
})

export { protect }
