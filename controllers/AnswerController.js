import mongoose from "mongoose"
import Answer from "../models/Answer.js"
import Form from "../models/Form.js"
import answerDuplicate from "../libraries/answerDuplicate.js"
import questionRequiredButEmpty from "../libraries/questionRequiredButEmpty.js"
import optionValueNotExist from "../libraries/optionValueNotExist.js"
import questionIdNotValid from "../libraries/questionIdNotValid.js"
import emailNotValid from "../libraries/emailNotValid.js"

class AnswerController {

    async store(req,res){
        try{
            if(!req.params.formId){throw {code: 400, message: 'REQUIRED_FORM_ID'}}
            if(!mongoose.Types.ObjectId.isValid(req.params.formId)){ throw {code: 400, message: 'INVALID_ID'}}

            const form = await Form.findById({_id: req.params.formId})

            const isDuplicate = await answerDuplicate(req.body.answers)
            if(isDuplicate) {throw {code: 400, message: 'DUPLICATE_ANSWER'}}
            
            const questionRequiredEmpty = await questionRequiredButEmpty(form, req.body.answers)
            if(questionRequiredEmpty) {throw {code: 400, message: 'QUESTION_REQUIRED_BUT_EMPTY'}}

            const optionNotExist = await optionValueNotExist(form, req.body.answers)
            if(optionNotExist){throw {code: 400, message: 'OPTION_VALUE_NOT_EXIST', question: optionNotExist}}

            const questionNotExist = await questionIdNotValid(form, req.body.answers)
            if(questionNotExist){throw {code: 400, message: 'QUESTION_NOT_EXIST', question: questionNotExist[0].questionId}}

            const emailIsNotValid = await emailNotValid(form, req.body.answers)
            if(emailIsNotValid){throw {code: 400, message: 'EMAIL_IS_NOT_VALID'}}
            
            let fields = {}
            req.body.answers.forEach(answer => {
                fields[answer.questionId] = answer.value
            })

            const answer = await Answer.create({
                formId: req.params.formId,
                userId: req.jwt.id,
                ...fields
            })

            if(!answer){ throw {code: 400, message: 'ANSWER_FAILED'}}

            return res.status(200)
                        .json({
                            status: true,
                            message: 'ANSWER_SUCCESS',
                            answer
                        })

        }catch(error){
            return res.status(error.code || 500)
                    .json({
                        status: false,
                        message: error.message,
                        question: error.question || null
                    })
        }

    }


}

export default new AnswerController()