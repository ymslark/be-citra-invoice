// ON_PROGRESS

import mongoose from 'mongoose'
import mongoosePaginate from "mongoose-paginate-v2"

const Schema = new mongoose.Schema({
    no_seri : {
        type: String,
    },
    tanggal : {
      type: String,
    },
    hal : {
        type: String,
    },
    tujuan : {
        type: String,
    },
    tempo : {
        type: Boolean,
    },
    tanggal_tempo : {
        type: String,
    },
    status : {
        type: String,
        enum: ['WAITING','PROCCESS','DONE','CANCEL'],
        
    },
    barang : {
        type: Array
    },
    rekening : {
        type: Object,
    },
    catatan_tempo:{
        type: String
    },
    catatan:{
        type: Array
    },
    ongkos_kirim: {
        type: Boolean
    },
    instalasi: {
        type: Boolean
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
        strict : false,
        timestamps: {
            currentTime: () => Math.floor(Date.now() / 1000)
        }
    }
)

Schema.plugin(mongoosePaginate)
export default mongoose.model('CF', Schema)