import express from 'express'

import { getProfessors } from '../controllers/professors.js'

const router = express.Router({ mergeParams: true })

router.route('/').get(getProfessors)

export { router }