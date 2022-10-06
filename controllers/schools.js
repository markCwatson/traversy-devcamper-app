import { School } from '../models/school.js'

// @desc    Get all schools in database.
// @route   GET /api/v1/schools
// @access  Public
const getSchools = (req, res, next) => {
    res.status(200).json({ success: true })
}

// @desc    Get a school by id.
// @route   GET /api/v1/schools/:id
// @access  Public
const getSchool = (req, res, next) => {
    res.status(200).json({ success: true })
}

// @desc    Create a new school.
// @route   POST /api/v1/schools
// @access  Private
const createSchool = async (req, res, next) => {
    try {
        const school = await School.create(req.body)
        res.status(201).json({ success: true, data: school })
    } catch (error) {
        res.status(400).json({ success: false })
    }
}

// @desc    Update a school by id.
// @route   PUT /api/v1/schools/:id
// @access  Private
const updateSchool = (req, res, next) => {
    res.status(200).json({ success: true })
}

// @desc    Delete a school by id.
// @route   DELETE /api/v1/schools/:id
// @access  Private
const deleteSchool = (req, res, next) => {
    res.status(200).json({ success: true })
}

export { getSchools, getSchool, createSchool, updateSchool, deleteSchool }