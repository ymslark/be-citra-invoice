import mongoose from 'mongoose'
import mongoosePaginate from "mongoose-paginate-v2"

const Schema = new mongoose.Schema({
    pembeli:{  
        nama_pembeli: {
            type: String,
            required: true
        },
        alamat: {
            type: String,
            required: true
        },
        npwp: {
            type: String,
            required: true
        },
        gambar_npwp: {
            type: String,
            required: true
        },
        no_hp:{
            type: String,
            required: true
        }
    },
    tanggal: {
        type: String,
        required: true
    },
    tanggal_pembelian: {
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['WAITING', 'APPROVED', 'REJECTED','DONE'],
        default: 'WAITING'
    },
    barang: {
        type: Array,
        required: true
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
  },

)
Schema.plugin(mongoosePaginate)
export default mongoose.model('Faktur', Schema)