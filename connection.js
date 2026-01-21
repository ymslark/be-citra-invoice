import dotenv from 'dotenv'
import mongoose from 'mongoose'

const env = dotenv.config().parsed

const connection = () => {
    mongoose.connect(env.MONGODB_URI, {
        dbName: env.MONGODB_NAME,
        user: env.MONGODB_USERNAME,
        pass: env.MONGODB_PASSWORD
    })
    
const conn = mongoose.connection
conn.on('error', console.error.bind(console, 'Connection Error :'))
conn.once('open', () => {
    console.log('Connected to mongoDB!')
})
}

export default connection