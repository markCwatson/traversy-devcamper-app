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

const router = express.Router()
router.use('/:schoolId/professors', professorRouter)

router.route('/').get(advancedResults(School, { path: 'professors', select: 'name' }), getSchools)
router.route('/').post(createSchool)
router.route('/:id').get(getSchool)
router.route('/:id').put(updateSchool)
router.route('/:id').delete(deleteSchool)
router.route('/:id/photo').put(uploadSchoolPhoto)
router.route('/radius/:postalCode/:distance').get(getSchoolInRadius)

export { router }