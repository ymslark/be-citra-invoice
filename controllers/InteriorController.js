import mongoose from "mongoose"
import Interior from '../models/Interior.js'
import methodAuthorized  from "../libraries/methodAuthorized.js";
 
 
class InteriorController {

    async index(req,res){
        try {
            roleAuthorized = ['super_admin', 'admin', 'developer']
            if(!methodAuthorized(req.jwt.id, roleAuthorized)) throw {code: 402, message: "NOT_AUTHORIZED"}
            const limit = req.query.limit || 5
            const page  = req.query.page || 1
            const Interiors = await Interior.paginate({userId: req.jwt.id},
{
                                                    limit: limit,
                                                    page : page
                                                  })
            if(!Interiors) {throw {code: 404, message: '_NOT_FOUND'}}
            return res.status(200)
                    .json({
                        status: true,
                        message: "_FOUND",
                        total: Interiors.totalDocs,
                        Interiors
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
            const result = Interior.find({name: { regex: '.*' + item + '.*'
        }
      }).limit(5)
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
            
            const Interior = await Interior.create({})
            
            if(!Interior){ throw { code: 500, message: 'FAILED_CREATED_'
        }
      }
            log = await Log.create({
              collection: 'Interior',
              objectId: Interior._id
      })
            return res.status(200)
                        .json({
                            status: true,
                            message: 'SUCCESS_CREATE_',
                            Interior
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
            if(!req.params.id){throw {code: 400, message: 'REQUIRED_ID'
        }
      }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) {throw {code: 404, message: 'INVALID_ID'
        }
      }

            const Interior = await Interior.findOne({_id: req.params.id, userId: req.jwt.id
      })
            if(!Interior) {throw {code: 404, message: '_NOT_FOUND'
        }
      }

            return res.status(200)
                    .json({
                        status: true,
                        message: `_FOUND`,
                        Interior
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
            if(!req.params.id){throw {code: 400, message: 'REQUIRED_ID'
        }
      }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) {throw {code: 400, message: 'INVALID_ID'
        }
      }

            const Interior = await Interior.findOneAndUpdate({_id: req.params.id, userId: req.jwt.id
      }, req.body,
      { new: true
      })
            if(!Interior) {throw {code: 400, message: 'Interior_UPDATE_FAILED'
        }
      }

            return res.status(200)
                    .json({
                        status: true,
                        message: `Interior_UPDATE_SUCCESS`,
                        Interior
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
            if(!req.params.id){throw {code: 400, message: 'REQUIRED_ID'
        }
      }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) {throw {code: 400, message: 'INVALID_ID'
        }
      }

            const Interior = await Interior.findOneAndDelete({_id: req.params.id, userId: req.jwt.id
      })
            if(!Interior) {throw {code: 400, message: 'Interior_DELETE_FAILED'
        }
      }

            return res.status(200)
                    .json({
                        status: true,
                        message: `Interior_DELETE_SUCCESS`,
                        Interior
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

export default new InteriorController()