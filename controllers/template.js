import mongoose from "mongoose"
import  from '../models/.js'
import methodAuthorized  from "../libraries/methodAuthorized.js";


class FormController {

    async index(req,res){
        try {
            roleAuthorized = ['super_admin', 'admin', 'developer']
            if(!methodAuthorized(req.jwt.id, roleAuthorized)) throw {code:402, message:"NOT_AUTHORIZED"}
            const limit = req.query.limit || 5
            const page  = req.query.page || 1
            const forms = await Form.paginate({userId: req.jwt.id},
                                                {
                                                    limit: limit,
                                                    page : page
                                                })
            if(!forms) {throw {code: 404, message: '_NOT_FOUND'}}
            return res.status(200)
                    .json({
                        status: true,
                        message: "_FOUND",
                        total: forms.totalDocs,
                        forms
                    })
    
        }catch(error){
            console.log(error)
            return res.status(error.code || 500)
                    .json({
                        status: false,
                        message: error.message
                    })
        }
    }

    async search(req,res){
        try {
            item = req.body.item
            const result = Form.find({name: { $regex: '.*' + item + '.*' } }).limit(5)
            return res.status(200)
                    .json({
                        status: true,
                        item: result
                    })
        } catch (error) {
            return res.status(error.code||500)
                            .json({
                                status: false,
                                message: error.message
                            })
        }
    }

    async store(req,res){
        try {
            
            const form = await Form.create({
                
            })
            
            if(!form){ throw { code:500, message: 'FAILED_CREATED_'}}
            log = await Log.create({
              collection: 'form',
              objectId: form._id
            })
            return res.status(200)
                        .json({
                            status: true,
                            message: 'SUCCESS_CREATE_',
                            form
                        })
        } catch (error) {
                return res.status(error.code||500)
                            .json({
                                status: false,
                                message: error.message
                            })
        }
    }

    async show(req,res){
        try {
            if(!req.params.id){throw {code: 400, message: 'REQUIRED_ID'}}
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) {throw {code: 404, message: 'INVALID_ID'}}

            const form = await Form.findOne({_id: req.params.id, userId: req.jwt.id})
            if(!form) {throw {code: 404, message: '_NOT_FOUND'}}

            return res.status(200)
                    .json({
                        status: true,
                        message: "_FOUND",
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

    async update(req,res){
        try {
            if(!req.params.id){throw {code: 400, message: 'REQUIRED_ID'}}
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) {throw {code: 400, message: 'INVALID_ID'}}

            const form = await Form.findOneAndUpdate({_id: req.params.id, userId: req.jwt.id}, req.body, { new: true })
            if(!form) {throw {code: 400, message: 'FORM_UPDATE_FAILED'}}

            return res.status(200)
                    .json({
                        status: true,
                        message: "FORM_UPDATE_SUCCESS",
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

    async destroy(req,res){
        try {
            if(!req.params.id){throw {code: 400, message: 'REQUIRED_ID'}}
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) {throw {code: 400, message: 'INVALID_ID'}}

            const form = await Form.findOneAndDelete({_id: req.params.id, userId: req.jwt.id})
            if(!form) {throw {code: 400, message: 'FORM_DELETE_FAILED'}}

            return res.status(200)
                    .json({
                        status: true,
                        message: "FORM_DELETE_SUCCESS",
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
}

export default new FormController()