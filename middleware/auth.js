import jwt from 'jsonwebtoken'
import { asyncHandler } from './async.js'
import { User } from "../models/user.js"
import { ErrorResponse } from '../utils/errorResponse.js'


const checkToken = asyncHandler(async (req, res, next) => {
    let token
    const { authorization } = req.headers

    if (authorization && authorization.startsWith('Bearer')) {
        // Use token in header...
        token = authorization.split(' ')[1]
    } else if (req.cookies.token) {
        /// ... or in cookie
        token = req.cookies.token
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

const checkRole = (role) => {
    return (res, req, next) => {
        if (role !== res.user.role) {
            return next(new ErrorResponse('Not authorized!', 403))
        }

        next()
    }
}

const confirmOwnershp = (Model) => {
    return async (req, res, next) => {
        let entity
        
        // This is a bit of a hack to get this middleware to work with both school and prof
        if (req.params.id) {
            entity = await Model.findById(req.params.id)
        } else if (req.params.schoolId) {
            // Since the school router routes /:schoolId/professors to the professor route...
            // the schoolId is being mergeparams-ed rather than id.
            entity = await Model.findOne({ school: req.params.schoolId })
        }

        if (!entity) {
            return next(new ErrorResponse('Entity not found!', 404))
        }

        if ((entity.user.toString() !== req.user.id) && (req.user.role !== 'Admin')) {
            return next(new ErrorResponse('This user cannot modify this entity!', 401))
        }

        next()
    }
}

export {
    checkToken,
    checkRole,
    confirmOwnershp
}