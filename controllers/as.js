import mongoose from "mongoose"
import Supir from '../models/Supir.js'
import methodAuthorized  from "../libraries/methodAuthorized.js";
 
 
class SupirController {

    async index(req,res){
        try {
            roleAuthorized = ['super_admin', 'admin', 'developer']
            if(!methodAuthorized(req.jwt.id, roleAuthorized)) throw {code: 402, message: "NOT_AUTHORIZED"}
            const limit = req.query.limit || 5
            const page  = req.query.page || 1
            const Supirs = await Supir.paginate({userId: req.jwt.id},
{
                                                    limit: limit,
                                                    page : page
                                                  })
            if(!Supirs) {throw {code: 404, message: '_NOT_FOUND'}}
            return res.status(200)
                    .json({
                        status: true,
                        message: "_FOUND",
                        total: Supirs.totalDocs,
                        Supirs
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
            const result = Supir.find({name: { regex: '.*' + item + '.*'
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
            
            const Supir = await Supir.create({})
            
            if(!Supir){ throw { code: 500, message: 'FAILED_CREATED_'
        }
      }
            log = await Log.create({
              collection: 'Supir',
              objectId: Supir._id
      })
            return res.status(200)
                        .json({
                            status: true,
                            message: 'SUCCESS_CREATE_',
                            Supir
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

            const Supir = await Supir.findOne({_id: req.params.id, userId: req.jwt.id
      })
            if(!Supir) {throw {code: 404, message: '_NOT_FOUND'
        }
      }

            return res.status(200)
                    .json({
                        status: true,
,
                        message: 
,
                        Supir
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

            const Supir = await Supir.findOneAndUpdate({_id: req.params.id, userId: req.jwt.id
      }, req.body,
      { new: true
      })
            if(!Supir) {throw {code: 400, message: 'Supir_UPDATE_FAILED'
        }
      }

            return res.status(200)
                    .json({
                        status: true,
                        message: `Supir_UPDATE_SUCCESS`,
                        Supir
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

            const Supir = await Supir.findOneAndDelete({_id: req.params.id, userId: req.jwt.id
      })
            if(!Supir) {throw {code: 400, message: 'Supir_DELETE_FAILED'
        }
      }

            return res.status(200)
                    .json({
                        status: true,
                        message: `Supir_DELETE_SUCCESS`,
                        Supir
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

export default new SupirController()