import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const Schema = new mongoose.Schema({
    no_hp : {
        type: String,
        required: true
    },
    tujuan:{
        type: String
    },
    alamat:{
        type: String,
    },
    tanggal: {
      type: String
    },
    status: {
      type: String,
      default: 'PENDING'
    },
    barang:{
        type: Array
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
export default mongoose.model('ReqSCI', Schema)
