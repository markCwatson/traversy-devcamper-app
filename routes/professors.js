import express from 'express'

import { 
    getProfessors,
    getProfessor,
    addProfessor,
    updateProfessor,
    deleteProfessor,
    uploadProfessorPhoto } from '../controllers/Professors.js'

import { Professor } from '../models/Professor.js'
import { advancedResults } from '../middleware/advancedResults.js'

const router = express.Router({ mergeParams: true })

router.route('/').get(advancedResults(Professor, { path: 'school', select: 'name location.formattedAddress' }), getProfessors)
router.route('/').post(addProfessor)
router.route('/:id').get(getProfessor)
router.route('/:id').put(updateProfessor)
router.route('/:id').delete(deleteProfessor)
router.route('/:id/photo').put(uploadProfessorPhoto)

export { router }