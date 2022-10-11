import { Professor } from '../models/professor.js'
import { School } from '../models/school.js'
import { ErrorResponse } from '../utils/errorResponse.js'
import { asyncHandler } from '../middleware/async.js'


// @desc    Get all professors in database.
// @route   GET /api/v1/professors
// @route   GET /api/v1/schools/:schoolId/professors
// @access  Public
const getProfessors = asyncHandler(async (req, res, next) => {
    let query

    if (req.params.schoolId) {
        query = Professor.find({ school: req.params.schoolId })
    } else [
        query = Professor.find().populate({
            path: 'school',
            select: 'name location.formattedAddress'
        })
    ]

    const schools = await query

    res.status(200).json({
        success: true,
        count: schools.length,
        data: schools
    })
})

// @desc    Get a single professor in database.
// @route   GET /api/v1/professors/:id
// @access  Public
const getProfessor = asyncHandler(async (req, res, next) => {
    const prof = await Professor.findById(req.params.id).populate({
        path: 'school',
        select: 'name location.formattedAddress'
    })
    
    if (!prof) {
        return next(new ErrorResponse('No professor found!', 404))
    }

    res.status(200).json({
        success: true,
        data: prof
    })
})

// @desc    Add a new professor to database.
// @route   POST /api/v1/schools/:schoolId/professors
// @access  Private
const addProfessor = asyncHandler(async (req, res, next) => {
    // Add this professor to a school using the field in professor model
    req.body.school = req.params.schoolId

    const school = await School.findById(req.params.schoolId)
    
    if (!school) {
        return next(new ErrorResponse('No school found!', 404))
    }

    const prof = await Professor.create(req.body)

    res.status(200).json({
        success: true,
        data: prof
    })
})

export { getProfessors, getProfessor, addProfessor }