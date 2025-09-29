import mongoose from 'mongoose'

const Schema = new mongoose.Schema({
    username : {
        type: String,
        unique: true,
    },
    fullname : {
        type: String,
        required: true
    },
    email : {
        type: String,
        unique: true,
    },
    password : {
        type: String,
        required: true
    },
    status : {
        type: String,
        enum: [`active`, `inactive`],
        default: 'active'
    },
    role : {
      type: String,
      enum: ['admin', 'super_admin', 'developer'],
      default: 'admin'
    },
    isActive : {
        type: Boolean //true = active, false = inactive/deleted
    },
    createdAt :{
        type: Number
    },
    updatedAt: {
        type: Number
    }
    
},  {
        timestamps: {
            currentTime: () => Math.floor(Date.now() / 1000)
        }
    }
)


export default mongoose.model('User', Schema)