import mongoose from 'mongoose'


const Schema = new mongoose.Schema({

    
    ppn:{
        type: Number
    },
    rekening :{
        type: Object
    },
    createdAt : {
        type: Number
    },
    updatedAt: {
        type: Number
    }
},{  
    strict : false,
    timestamps: {
        currentTime: () => Math.floor(Date.now() / 1000)
    }
  }
)
export default mongoose.model('Config', Schema)