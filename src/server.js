import path from 'path';
import { fileURLToPath } from 'url';

import express from 'express'
import morgan from 'morgan'
import fileupload from 'express-fileupload'
import cookieParser from 'cookie-parser'

import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import xss from 'xss-clean'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
import cors from 'cors'

import { router as schools }  from '../routes/schools.js'
import { router as professors }  from '../routes/professors.js'
import { router as users} from '../routes/users.js'
import { connectDb } from './db/mongoose.js'
import { errorHandler } from '../middleware/error.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDb()

const app = express()

app.use(express.json())
app.use(cookieParser())

// Must setup middleware before route definitions

if (process.env.NODE_ENV === 'dev')
{
    app.use(morgan('dev'))
}

// By default, $ and . characters are removed completely from user-supplied input in: req.body/params/headers/query
app.use(mongoSanitize())
// Add XSS protection
app.use(xss())
// Add extra security headers
app.use(helmet())
// Protect against HTTP Parameter Pollution attacks
app.use(hpp())
// Enable CORS
app.use(cors())

// Limit repeated requests to public APIs and/or endpoints
// Apply the rate limiting middleware to all requests
app.use(rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))

// For uploading pics
app.use(fileupload())

// Set up static folder (visit url/uploads/<filename>)
app.use(express.static(path.join(__dirname, '../public')))

// Setup routes
app.use('/api/v1/schools', schools)
app.use('/api/v1/professors', professors)
app.use('/api/v1/user', users)
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