import jwt from 'jsonwebtoken'
import { asyncHandler } from './async.js'
import { User } from "../models/user.js"
import { ErrorResponse } from '../utils/errorResponse.js'


const checkToken = asyncHandler(async (req, res, next) => {
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
        const entity = await Model.findById(req.params.id)

        if (!entity) {
            return next(new ErrorResponse('Entity not found!', 404))
        }

        if ((entity.user.toString() !== req.user.id) && (req.user.role !== 'Admin')) {
            return next(new ErrorResponse('This user cannot delete this entity!', 401))
        }

        next()
    }
}

export {
    checkToken,
    checkRole,
    confirmOwnershp
}
