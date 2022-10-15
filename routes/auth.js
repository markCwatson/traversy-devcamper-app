import express from 'express'

import { checkToken } from '../middleware/auth.js'

import {
    registerUser,
    deleteUser,
    loginUser,
    getCurrentUser
} from "../controllers/auth.js"

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/:id').delete(checkToken, deleteUser)
router.route('/me').get(checkToken, getCurrentUser)

export { router }