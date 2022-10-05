import express from 'express'

const server = express()

server.listen(process.env.PORT, () => {
    console.log(`Server up on port ${process.env.PORT}`)
})