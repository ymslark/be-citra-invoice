import dotenv from 'dotenv'
import mongoose from 'mongoose'

const env = dotenv.config().parsed
let connection = null

if(env.MONGODB_USERNAME === '' && env.MONGODB_PASSWORD === '') {
    connection = () => {
        mongoose.connect(env.MONGODB_URI, {
            dbName: env.MONGODB_NAME,
        })
    }
}else{
    connection = () => {
        mongoose.connect(env.MONGODB_URI, {
            dbName: env.MONGODB_NAME,
        })
    }
}
const conn = mongoose.connection
conn.on('error', console.error.bind(console, 'Connection Error :'))
conn.once('open', () => {
    console.log('Connected to mongoDB!')
})


export default connection