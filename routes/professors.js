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
import { protect } from '../middleware/auth.js'

const router = express.Router({ mergeParams: true })

router.route('/').get(advancedResults(Professor, { path: 'school', select: 'name location.formattedAddress' }), getProfessors)
router.route('/').post(protect, addProfessor)
router.route('/:id').get(getProfessor)
router.route('/:id').put(protect, updateProfessor)
router.route('/:id').delete(protect, deleteProfessor)
router.route('/:id/photo').put(protect, uploadProfessorPhoto)

export { router }