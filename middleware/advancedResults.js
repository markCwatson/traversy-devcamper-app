// @desc    Middleware for handling search queries.
const advancedResults = (Model, populate) => { 
    return async (req, res, next) => {
        let query

        const queryCopy = { ...req.query }
        const removeFields = ['select', 'sort', 'page', 'limit']
        removeFields.forEach(param => delete queryCopy[param])
        
        let options = JSON.stringify(queryCopy)
        options = options.replace(/\b(in|lte|gte|lt|gt)\b/g, match => `$${match}`)

        query = Model.find(JSON.parse(options))
        
        if (populate) {
            query = query.populate(populate)
        }

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

        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 25
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const total = await Model.countDocuments()
        query = query.skip(startIndex).limit(limit)

        const results = await query

        const pagination = {}

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        if (!results) {
            return next(new ErrorResponse('Nothing found!', 404))
        }

        res.advancedResults = {
            success: true,
            count: results.length,
            pagination,
            data: results
        }

        next()
    }
}

export { advancedResults }