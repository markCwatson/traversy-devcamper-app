import express from 'express'

import { 
    getProfessors,
    getProfessor,
    createProfessor,
    updateProfessor,
    deleteProfessor,
    uploadProfessorPhoto
} from '../controllers/professors.js'

import { Professor } from '../models/Professor.js'
import { advancedResults } from '../middleware/advancedResults.js'

import {
    checkToken,
    checkRole,
    confirmOwnershp
} from '../middleware/auth.js'

const router = express.Router({ mergeParams: true })

router.route('/').get(advancedResults(Professor, { path: 'school', select: 'name user location.formattedAddress' }), getProfessors)
router.route('/').post(checkToken, confirmOwnershp(Professor), createProfessor)
router.route('/:id').get(getProfessor)
router.route('/:id').put(checkToken, confirmOwnershp(Professor), updateProfessor)
router.route('/:id').delete(checkToken, confirmOwnershp(Professor), deleteProfessor)
router.route('/:id/photo').put(checkToken, confirmOwnershp(Professor), uploadProfessorPhoto)

export { router }