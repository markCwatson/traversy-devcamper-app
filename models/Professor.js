import mongoose from 'mongoose'

const ProfessorSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please include a name!']
    },
    email: {
        type: String,
        required: [true, 'Please include an email!']
    },
    office: {
        type: String,
        required: [true, 'Please include an office!']
    },
    school: {
        type: mongoose.Schema.ObjectId,
        ref: 'School',
        required: true
    }
})

const Professor = mongoose.model('Professor', ProfessorSchema)

export { Professor }