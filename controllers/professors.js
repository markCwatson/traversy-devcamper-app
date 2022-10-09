import { Professor } from '../models/professor.js'
import { ErrorResponse } from '../utils/errorResponse.js'
import { asyncHandler } from '../middleware/async.js'


// @desc    Get all professors in database.
// @route   GET /api/v1/professors
// @route   GET /api/v1/schools/:schoolId/courses
// @access  Public
const getProfessors = asyncHandler(async (req, res, next) => {
    let query

    if (req.params.schoolId) {
        query = Professor.find({ school: req.params.schoolId })
    } else [
        query = Professor.find()
    ]

    const schools = await query

    res.status(200).json({
        success: true,
        count: schools.length,
        data: schools
    })
})

export { getProfessors }