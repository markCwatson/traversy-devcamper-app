import express from 'express'

import { router as schools }  from './routes/schools.js'

const app = express()

app.use('/api/v1/schools', schools)

app.listen(process.env.PORT, () => {
    console.log(`Server up on port ${process.env.PORT}`)
})