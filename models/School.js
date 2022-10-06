import mongoose from 'mongoose'

const SchoolSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [true, 'Please include a school name!'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name must be less than 50 characters!']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please include a description!'],
        unique: true,
        trim: true,
        maxlength: [500, 'Description must be less than 500 characters!']
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 
            'Please include a valid URL!'
        ]
    },
    phone: {
      type: String,
      maxlength: [12, 'Phone number must be less than 12 characters!']
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    address: {
      type: String,
      required: [true, 'Please include an address!']
    },
    location: {
        // GeoJSON Point
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        province: String,
        postalCode: String,
        country: String
    },
    programs: {
        // Array of strings
        type: [String],
        required: true,
        enum: [
            'Engineering',
            'Science',
            'Arts',
            'Nursing',
            'Medicine',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
        createdAt: {
        type: Date,
        default: Date.now
    }},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
})

const School = mongoose.model('School', SchoolSchema)

export { School }