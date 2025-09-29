import mongoose from 'mongoose'

const Schema = new mongoose.Schema({
  nama: {
    type: String
  },
  no_kendaraan: {
    type: String
  },
  no_hp:{
    type: String
  },
  rating:{
    type: mongoose.Schema.Types.Decimal128
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
},
{   
        strict : false,
        timestamps: {
            currentTime: () => Math.floor(Date.now() / 1000)
        }
    }
)
export default mongoose.model('Supir', Schema)