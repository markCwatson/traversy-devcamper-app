import { School } from '../models/school.js'
import { ErrorResponse } from '../utils/errorResponse.js'
import { asyncHandler } from '../middleware/async.js'

import { geocoder } from '../utils/geocoder.js'

// @desc    Get all schools in database.
// @route   GET /api/v1/schools
// @access  Public
const getSchools = asyncHandler(async (req, res, next) => {
    let query
    
    const queryCopy = { ...req.query }
    const removeFields = ['select', 'sort']
    removeFields.forEach(param => delete queryCopy[param])
    
    let options = JSON.stringify(queryCopy)
    options = options.replace(/\b(in|lte|gte|lt|gt)\b/g, match => `$${match}`)
    query = School.find(JSON.parse(options))

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }

    if (req.query.sort) {
        const fields = req.query.sort.split(',').join(' ')
        query = query.sort(fields)
    } else {
        query = query.sort('-createdAt')
    }

    const schools = await query

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

// @desc    Get all schools within a radius (in kilometers).
// @route   GET /api/v1/schools/radius/:postalCode/:distance
// @access  Private
const getSchoolInRadius = asyncHandler(async (req, res, next) => {
    const { postalCode, distance } = req.params

    const location = await geocoder.geocode(postalCode)
    const long = location[0].longitude
    const lat = location[0].latitude
    const radius = distance / 6378.1
    const schools = await School.find({
        location: { $geoWithin: { $centerSphere: [ [ long, lat], radius ] } }
    })

    res.status(200).json({
        success: true,
        count: schools.length,
        data: schools
    })
})

export { getSchools, getSchool, createSchool, updateSchool, deleteSchool, getSchoolInRadius }