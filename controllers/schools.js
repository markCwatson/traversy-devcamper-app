import path from 'path'

import { School } from '../models/School.js'
import { ErrorResponse } from '../utils/errorResponse.js'
import { asyncHandler } from '../middleware/async.js'

import { geocoder } from '../utils/geocoder.js'

// @desc    Get all schools in database.
// @route   GET /api/v1/schools
// @access  Public
const getSchools = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
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
    const school = await School.findById(req.params.id)

    if (!school) {
        return next(new ErrorResponse('School not found', 404))
    }

    await school.remove()

    res.status(200).json({
        success: true,
        data: {}
    })
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

// @desc    DUpload a photo.
// @route   PUT /api/v1/schools/:id/photo
// @access  Private
const uploadSchoolPhoto = asyncHandler(async (req, res, next) => {
    const school = await School.findById(req.params.id)
    
    if (!school) {
        return next(new ErrorResponse('School not found!', 404))
    }

    if (!req.files) {
        return next(new ErrorResponse('Please upload an image!', 400))
    }

    const file = req.files.file

    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse('Please upload an image!', 400))
    }
    
    if (file.size > process.env.MAX_FILE_SIZE) {
        return next(new ErrorResponse(`Max filesize is ${process.env.MAX_FILE_SIZE / 1e6} MB`, 400))
    }

    file.name = `${school._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.PHOTO_PATH}/${file.name}`, async (err) => {
        if (err) {
            return next(new ErrorResponse(`Error uploading file!`, 500))
        }

        await School.findByIdAndUpdate(req.params.id, {
            photo: file.name
        })

        res.status(200).json({
            success: true,
            data: file.name
        })
    })
})

export { 
    getSchools,
    getSchool,
    createSchool,
    updateSchool,
    deleteSchool,
    getSchoolInRadius,
    uploadSchoolPhoto
}