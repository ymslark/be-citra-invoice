import 'mongoose'

const Schema = new Mongoose.Schema({
    createdAt :{
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
export default mongoose.model('', Schema)