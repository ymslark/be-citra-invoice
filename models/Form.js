import mongoose from 'mongoose'
import mongoosePaginate from "mongoose-paginate-v2"

const Schema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title : {
        type: String,
    },
    description : {
        type: String,
    },
    questions : {
        type: Array
    },
    invites : {
        type: Array // ['orta@gmail.com', 'zozor@gmail.com']
    },
    public : {
        type: Boolean //true = public, false = private
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
Schema.virtual('answers', 
{   ref: 'Answer',
    localField: '_id',
    foreignField: 'formId'
})
export default mongoose.model('Form', Schema)