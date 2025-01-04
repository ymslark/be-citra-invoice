//ON_PROGRESS

import mongoose from 'mongoose'

const Schema = new mongoose.Schema({
    tujuan:{
        type: String
    },
    alamat:{
        type: String
    },
    perusahaan:{
        type: String
    },
    nama_supir:{
        type: String
    },
    no_supir:{
        type: String
    },
    no_kendaraan:{
        type: String
    },
    jenis:{
        type: String,
        enum : ['Pengambilan Barang', 'Pengiriman Barang']
    },
    tanggal:{
        type: String
    },
    barang:{
        type: array
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
export default mongoose.model('Memo', Schema)

