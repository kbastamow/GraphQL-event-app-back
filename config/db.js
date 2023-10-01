const mongoose = require('mongoose')
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`database connected: ${conn.connection.host}`)
    } catch (error) {
        throw new Error('Error connecting to db')
    }
}

module.exports = { connectDB }