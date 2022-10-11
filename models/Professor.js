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
    salary: {
        type: Number,
        required: true
    },
    school: {
        type: mongoose.Schema.ObjectId,
        ref: 'School',
        required: true
    }
})

ProfessorSchema.statics.getAverageSalary = async function (schoolId) {
    const obj = await this.aggregate([
        {
            $match: { school: schoolId }
        },
        {
            $group: {
                _id: '$school',
                averageSalary: { $avg: '$salary' }
            }
        }
    ])

    try {
        await this.model('School').findByIdAndUpdate(schoolId, {
            averageSalary: Math.ceil(obj[0].averageSalary / 10) * 10
        })
    } catch (error) {
        console.error(error)
    }
}

ProfessorSchema.post('save', async function () {
    await this.constructor.getAverageSalary(this.school)
})

ProfessorSchema.pre('remove', async function () {
    await this.constructor.getAverageSalary(this.school)
})

const Professor = mongoose.model('Professor', ProfessorSchema)

export { Professor }