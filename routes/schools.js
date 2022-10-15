import express from 'express'

import { 
    getSchools,
    getSchool,
    createSchool,
    updateSchool,
    deleteSchool,
    getSchoolInRadius,
    uploadSchoolPhoto } from '../controllers/schools.js'

import { router as professorRouter} from './professors.js'
import { School } from '../models/School.js'
import { advancedResults } from '../middleware/advancedResults.js'
import { checkToken, confirmOwnershp } from '../middleware/auth.js'

const router = express.Router()
router.use('/:schoolId/professors', professorRouter)

router.route('/').get(advancedResults(School, { path: 'professors', select: 'name' }), getSchools)
router.route('/').post(checkToken, createSchool)
router.route('/:id').get(getSchool)
router.route('/:id').put(checkToken, confirmOwnershp(School), updateSchool)
router.route('/:id').delete(checkToken, confirmOwnershp(School), deleteSchool)
router.route('/:id/photo').put(checkToken, confirmOwnershp(School), uploadSchoolPhoto)
router.route('/radius/:postalCode/:distance').get(getSchoolInRadius)

export { router }