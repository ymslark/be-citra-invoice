import mongoose from 'mongoose'


const Schema = new mongoose.Schema({
    
    koleksi: {
        type: String
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId
    },
    data_objectId: {
        type: mongoose.Schema.Types.ObjectId
    },
    data: {
        type: Object
    },
    tanggal: {
        type: String
    },
    note: {
        type: String,
        required: true
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
export default mongoose.model('Log', Schema)