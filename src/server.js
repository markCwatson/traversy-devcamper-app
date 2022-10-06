import express from 'express'
import morgan from 'morgan'

import { router as schools }  from '../routes/schools.js'
import { connectDb } from './db/mongoose.js'
import { errorHandler } from '../middleware/error.js'

connectDb()

const app = express()

app.use(express.json())

if (process.env.NODE_ENV === 'dev')
{
    // Must setup middleware before route definitions
    app.use(morgan('dev'))
}

// Setup routes
app.use('/api/v1/schools', schools)
app.use(errorHandler)

const server = app.listen(process.env.PORT, () => {
    console.log(`Server up on port ${process.env.PORT}`)
})

process.on('unhandledRejection', (error, promise) => {
    console.log(`Error: ${error.message}`)
    
    server.close(() => {
        process.exit(1)
    })
})