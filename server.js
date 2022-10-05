import express from 'express'
import morgan from 'morgan'

import { router as schools }  from './routes/schools.js'

const app = express()

if (process.env.NODE_ENV === 'dev')
{
    // Must setup middleware before route definitions
    app.use(morgan('dev'))
}

// Setup routes
app.use('/api/v1/schools', schools)

app.listen(process.env.PORT, () => {
    console.log(`Server up on port ${process.env.PORT}`)
})