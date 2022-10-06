import { School } from '../models/school.js'

// @desc    Get all schools in database.
// @route   GET /api/v1/schools
// @access  Public
const getSchools = async (req, res, next) => {
    try {
        const schools = await School.find()

        if (!schools) {
            throw new Error('Schools not found!')
        }

        res.status(200).json({ success: true, count: schools.length, data: schools })
    } catch (error) {
        res.status(400).json({ success: false })
    }
}

// @desc    Get a school by id.
// @route   GET /api/v1/schools/:id
// @access  Public
const getSchool = async (req, res, next) => {
    try {
        const school = await School.findById(req.params.id)

        if (!school) {
            throw new Error('School not found!')
        }

        res.status(200).json({ success: true, data: school })
    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
}

// @desc    Create a new school.
// @route   POST /api/v1/schools
// @access  Private
const createSchool = async (req, res, next) => {
    try {
        const school = await School.create(req.body)

        if (!school) {
            throw new Error('School not created!')
        }
    
        res.status(201).json({ success: true, data: school })
    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
}

// @desc    Update a school by id.
// @route   PUT /api/v1/schools/:id
// @access  Private
const updateSchool = async (req, res, next) => {
    try {
        const school = await School.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })
    
        if (!school) {
            throw new Error('School not found!')
        }
    
        res.status(200).json({ success: true, data: school })
    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
}

// @desc    Delete a school by id.
// @route   DELETE /api/v1/schools/:id
// @access  Private
const deleteSchool = async (req, res, next) => {
    try {
        const school = await School.findByIdAndDelete(req.params.id)
    
        if (!school) {
            throw new Error('School not found!')
        }
    
        res.status(200).json({ success: true, data: {} })
    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
}

export { getSchools, getSchool, createSchool, updateSchool, deleteSchool }