import express from 'express'

import { 
    getSchools,
    getSchool,
    createSchool,
    updateSchool,
    deleteSchool,
    getSchoolInRadius } from '../controllers/schools.js'

const router = express.Router()

router.route('/').get(getSchools).post(createSchool)
router.route('/:id').get(getSchool).put(updateSchool).delete(deleteSchool)
router.route('/radius/:postalCode/:distance').get(getSchoolInRadius)

export { router }