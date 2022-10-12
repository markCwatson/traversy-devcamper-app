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

const router = express.Router()
router.use('/:schoolId/professors', professorRouter)

router.route('/').get(getSchools).post(createSchool)
router.route('/:id').get(getSchool).put(updateSchool).delete(deleteSchool)
router.route('/radius/:postalCode/:distance').get(getSchoolInRadius)
router.route('/:id/photo').put(uploadSchoolPhoto)

export { router }