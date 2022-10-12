import express from 'express'

import { 
    getProfessors,
    getProfessor,
    addProfessor,
    updateProfessor,
    deleteProfessor,
    uploadProfessorPhoto } from '../controllers/Professors.js'

const router = express.Router({ mergeParams: true })

router.route('/').get(getProfessors)
router.route('/').post(addProfessor)
router.route('/:id').get(getProfessor)
router.route('/:id').put(updateProfessor)
router.route('/:id').delete(deleteProfessor)
router.route('/:id/photo').put(uploadProfessorPhoto)

export { router }