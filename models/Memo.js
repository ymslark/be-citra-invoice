//ON_PROGRESS

import mongoose from 'mongoose'
import mongoosePaginate from "mongoose-paginate-v2"
const Schema = new mongoose.Schema({
    tujuan:{
        type: String
    },
    alamat:{
        type: String
    },
    no_hp:{
        type: String
    },
    perusahaan:{
        type: String
    },
    id_supir:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supir',
        required:true
    },
    jenis:{
        type: String,
        enum : ['Pengambilan Barang', 'Pengiriman Barang']
    },
    tanggal:{
        type: String
    },
    barang:{
        type: Array
    },
    status:{
        type: String,
        enum: ['WAITING', 'PROCCESS', 'DONE', 'CANCEL']
    },
    isActive:{
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
Schema.virtual('supirs', 
{   ref: 'Supir',
    localField: '_id',
    foreignField: 'id_supir'
})
export default mongoose.model('Memo', Schema)