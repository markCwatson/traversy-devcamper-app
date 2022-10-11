import express from 'express'

import { getProfessors, getProfessor, addProfessor } from '../controllers/professors.js'

const router = express.Router({ mergeParams: true })

router.route('/').get(getProfessors)
router.route('/').post(addProfessor)
router.route('/:id').get(getProfessor)

export { router }