import express from 'express'

import { 
    getProfessors,
    getProfessor,
    addProfessor,
    updateProfessor,
    deleteProfessor } from '../controllers/professors.js'

const router = express.Router({ mergeParams: true })

router.route('/').get(getProfessors)
router.route('/').post(addProfessor)
router.route('/:id').get(getProfessor)
router.route('/:id').put(updateProfessor)
router.route('/:id').delete(deleteProfessor)

export { router }