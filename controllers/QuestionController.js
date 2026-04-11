import mongoose from "mongoose"
import Form from  '../models/Form.js'

const allowedTypes = ['Text', 'Radio', 'Dropdown', 'Checkbox', 'Email'] 

class QuestionController{

    async index(req,res){
        try {
            if(!req.params.id){throw {code: 400, message: 'REQUIRED_FORM_ID'}}
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) {throw {code: 404, message: 'INVALID_ID'}}

            const form = await Form.findOne({_id: req.params.id, userId: req.jwt.id})
            if(!form) {throw {code: 404, message: 'FORM_NOT_FOUND'}}

            return res.status(200)
                    .json({
                        status: true,
                        message: "FORM_FOUND",
                        form 
                    })
    
        }catch(error){
            return res.status(error.code || 500)
                    .json({
                        status: false,
                        message: error.message
                    })
        }
    }


    async store(req, res){
        try {
            if(!req.params.id){ throw {code: 400, message: "REQUIRED_FORM_ID"}}
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) {throw {code: 400, message: "INVALID_ID"}}

            const newQuestion = {
                id : new mongoose.Types.ObjectId(),
                question: null,
                type: 'Text', //text, radio, dropdown, checkbox
                required: false,
                options: []
            }
            
            //update form
            const form = await Form.findOneAndUpdate({_id : req.params.id, userId : req.jwt.id },
                                                    { $push : {questions: newQuestion } },
                                                    { new: true})
            
            if(!form) { throw { code: 400, message: 'ADD_QUESTION_FAILED'}}

            return res.status(200)
                        .json({
                            status: true,
                            message: 'ADD_QUESTION_SUCCESS',
                            question: newQuestion
                        })
        } catch (error) {
            return res.status(error.code || 500)
                        .json({ status: false,
                                message: error.message
                            })
        }
    }

    async update(req, res){
        try {
            if(!req.params.id) {throw {code: 400, message: 'REQUIRED_FORM_ID'}}
            if(!req.params.questionId) {throw {code: 400, message: 'REQUIRED_QUESTION_ID'}}
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) {throw {code: 400, message: 'INVALID_ID'}}
            if(!mongoose.Types.ObjectId.isValid(req.params.questionId)) {throw {code: 400, message: 'INVALID_ID'}}
            
            let field = {}
            if(req.body.hasOwnProperty('question')) field['questions.$[indexQuestion].question'] = req.body.question

            
            if(req.body.hasOwnProperty('required')){ field['questions.$[indexQuestion].required'] = req.body.required }
            
            if(req.body.hasOwnProperty('type')){ 
                if(!allowedTypes.includes(req.body.type)){ throw {code: 400, message: 'INVALID_QUESTION_TYPE'}}
                field['questions.$[indexQuestion].type'] = req.body.type
            }


            const question = await Form.findOneAndUpdate({_id : req.params.id, userId: req.jwt.id},
                                                    { $set: field},
                                                    {
                                                        arrayFilters: [{'indexQuestion.id' : new mongoose.Types.ObjectId(req.params.questionId) }] ,
                                                        new: true 
                                                    })

            if(!question) { throw { code: 400, message: 'UPDATE_QUESTION_FAILED'}}

            return res.status(200)
                        .json({
                            status: true,
                            message: 'UPDATE_QUESTION_SUCCESS',
                            question
                        })

        } catch (error) {
            return res.status(error.code || 500)
                        .json({ status: false,
                                message: error.message
                            })
        }

    }

    async destroy(req, res){
        try {
            if(!req.params.id) {throw {code: 400, message: 'REQUIRED_FORM_ID'}}
            if(!req.params.questionId) {throw {code: 400, message: 'REQUIRED_QUESTION_ID'}}
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) {throw {code: 400, message: 'INVALID_ID'}}
            if(!mongoose.Types.ObjectId.isValid(req.params.questionId)) {throw {code: 400, message: 'INVALID_ID'}}

            //update form
            const form = await Form.findOneAndUpdate({_id : req.params.id, userId : req.jwt.id },
                                                    { $pull : 
                                                        {questions: 
                                                            { id: new mongoose.Types.ObjectId(req.params.questionId) } 
                                                        } 
                                                    },
                                                    { new: true})
            
            if(!form) { throw { code: 400, message: 'QUESTION_DELETE_FAILED'}}
            return res.status(200)
                        .json({
                            status: true,
                            message: 'DELETE_QUESTION_SUCCESS',
                            form
                        })
        } catch (error) {
            return res.status(error.code || 500)
                        .json({ status: false,
                                message: error.message
                            })
        }
    }


}

export default new QuestionController