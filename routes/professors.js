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
import { checkToken, checkRole } from '../middleware/auth.js'

const router = express.Router({ mergeParams: true })

router.route('/').get(advancedResults(Professor, { path: 'school', select: 'name location.formattedAddress' }), getProfessors)
router.route('/').post(checkToken, checkRole('admin'), addProfessor)
router.route('/:id').get(getProfessor)
router.route('/:id').put(checkToken, checkRole('admin'), updateProfessor)
router.route('/:id').delete(checkToken, checkRole('admin'), deleteProfessor)
router.route('/:id/photo').put(checkToken, checkRole('admin'), uploadProfessorPhoto)

export { router }