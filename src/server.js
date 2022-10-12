import express from 'express'
import morgan from 'morgan'
import fileupload from 'express-fileupload'
import path from 'path';
import { fileURLToPath } from 'url';

import { router as schools }  from '../routes/schools.js'
import { router as professors }  from '../routes/professors.js'
import { connectDb } from './db/mongoose.js'
import { errorHandler } from '../middleware/error.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDb()

const app = express()

app.use(express.json())

if (process.env.NODE_ENV === 'dev')
{
    // Must setup middleware before route definitions
    app.use(morgan('dev'))
}

app.use(fileupload())

// Set up static folder (visit url/uploads/<filename>)
app.use(express.static(path.join(__dirname, '../public')))

// Setup routes
app.use('/api/v1/schools', schools)
app.use('/api/v1/professors', professors)
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