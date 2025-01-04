import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const Schema = new mongoose.Schema({
    nama:{
        type: String
    },
    kode:{
        type: String,
        unique: true
    },
    satuan:{
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
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
Schema.plugin(mongoosePaginate)
export default mongoose.model('Barang', Schema)