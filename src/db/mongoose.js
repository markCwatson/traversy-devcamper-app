import mongoose from "mongoose";

const connectDb = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI)

    console.log(`MongoDB connected: ${conn.connection.host}`)
}

export { connectDb }