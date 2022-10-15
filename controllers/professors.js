import path from 'path'

import { Professor } from '../models/Professor.js'
import { School } from '../models/School.js'
import { ErrorResponse } from '../utils/errorResponse.js'
import { asyncHandler } from '../middleware/async.js'


// @desc    Get all professors in database.
// @route   GET /api/v1/professors
// @route   GET /api/v1/schools/:schoolId/professors
// @access  Public
const getProfessors = asyncHandler(async (req, res, next) => {
    if (req.params.schoolId) {
        const profs = Professor.find({ school: req.params.schoolId })

        res.status(200).json({
            success: true,
            count: profs.length,
            data: profs
        })
    } else {
        res.status(200).json(res.advancedResults)        
    }
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

// @desc    Create a new professor to database.
// @route   POST /api/v1/schools/:schoolId/professors
// @access  Private
const createProfessor = asyncHandler(async (req, res, next) => {
    // Add this professor to a school using the field in professor model
    req.body.school = req.params.schoolId

    // req.user comes from the checkToken middleware
    req.body.user = req.user

    const school = await School.findOne({ user: req.user.id })
    
    if (!school) {
        return next(new ErrorResponse('No school found!', 404))
    }

    const prof = await Professor.create(req.body)

    if (!prof) {
        return next(new ErrorResponse('Professor not created!', 400))
    }

    res.status(200).json({
        success: true,
        data: prof
    })
})

// @desc    Update a professor in database.
// @route   PUT /api/v1/professors/:id
// @access  Private
const updateProfessor = asyncHandler(async (req, res, next) => {
    const prof = await Professor.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
    
    if (!prof) {
        return next(new ErrorResponse('No professor found!', 404))
    }

    res.status(200).json({
        success: true,
        data: prof
    })
})

// @desc    Delete a professor in database.
// @route   DELETE /api/v1/professors/:id
// @access  Private
const deleteProfessor = asyncHandler(async (req, res, next) => {
    const prof = await Professor.findById(req.params.id)
    
    if (!prof) {
        return next(new ErrorResponse('Professor not found!', 404))
    }

    await prof.remove()

    res.status(200).json({
        success: true,
        data: {}
    })
})

// @desc    DUpload a photo.
// @route   PUT /api/v1/professors/:id/photo
// @access  Private
const uploadProfessorPhoto = asyncHandler(async (req, res, next) => {
    const prof = await Professor.findById(req.params.id)
    
    if (!prof) {
        return next(new ErrorResponse('Professor not found!', 404))
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

    file.name = `${prof._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.PHOTO_PATH}/${file.name}`, async (err) => {
        if (err) {
            return next(new ErrorResponse(`Error uploading file!`, 500))
        }

        await Professor.findByIdAndUpdate(req.params.id, {
            photo: file.name
        })

        res.status(200).json({
            success: true,
            data: file.name
        })
    })
})

export { 
    getProfessors,
    getProfessor,
    createProfessor,
    updateProfessor,
    deleteProfessor,
    uploadProfessorPhoto
}