import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [true, 'Please include a name!']
    },
    email: {
        type: String,
        required: [true, 'Please include n email!'],
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ],
        unique: [true, 'Email already taken!']
    },
    role: {
        type: String,
        enum: ['user', 'professor'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password!'],
        minlength: [6, 'Password must be at least 6 characters!'],
        select: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('User', UserSchema)

export { User }