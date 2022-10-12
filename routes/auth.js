import express from 'express'

import { registerUser, deleteUser, loginUser } from "../controllers/auth.js"

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/:id').delete(deleteUser)

export { router }