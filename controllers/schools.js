import { School } from '../models/school.js'
import { ErrorResponse } from '../utils/errorResponse.js'
import { asyncHandler } from '../middleware/async.js'

// @desc    Get all schools in database.
// @route   GET /api/v1/schools
// @access  Public
const getSchools = asyncHandler(async (req, res, next) => {
    const schools = await School.find()

    if (!schools) {
        return next(new ErrorResponse('No schools found!', 404))
    }

    res.status(200).json({ success: true, count: schools.length, data: schools })
})

// @desc    Get a school by id.
// @route   GET /api/v1/schools/:id
// @access  Public
const getSchool = asyncHandler(async (req, res, next) => {
    const school = await School.findById(req.params.id)

    if (!school) {
        return next(new ErrorResponse('School not found', 404))
    }

    res.status(200).json({ success: true, data: school })
})

// @desc    Create a new school.
// @route   POST /api/v1/schools
// @access  Private
const createSchool = asyncHandler(async (req, res, next) => {
    const school = await School.create(req.body)

    if (!school) {
        return next(new ErrorResponse('School not created!', 400))
    }

    res.status(201).json({ success: true, data: school })
})

// @desc    Update a school by id.
// @route   PUT /api/v1/schools/:id
// @access  Private
const updateSchool = asyncHandler(async (req, res, next) => {
    const school = await School.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })

    if (!school) {
        return next(new ErrorResponse('School not found', 404))
    }

    res.status(200).json({ success: true, data: school })
})

// @desc    Delete a school by id.
// @route   DELETE /api/v1/schools/:id
// @access  Private
const deleteSchool = asyncHandler(async (req, res, next) => {
    const school = await School.findByIdAndDelete(req.params.id)

    if (!school) {
        return next(new ErrorResponse('School not found', 404))
    }

    res.status(200).json({ success: true, data: {} })
})

export { getSchools, getSchool, createSchool, updateSchool, deleteSchool }