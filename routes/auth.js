import express from 'express'

import { registerUser, deleteUser } from "../controllers/auth.js"

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/:id').delete(deleteUser)

export { router }