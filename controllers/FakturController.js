import mongoose from "mongoose"
import Faktur from '../models/Faktur.js'
import methodAuthorized  from "../libraries/methodAuthorized.js";
 
 
class FakturController {

    async index(req,res){
        try {
            roleAuthorized = ['super_admin', 'admin', 'developer']
            if(!methodAuthorized(req.jwt.id, roleAuthorized)) throw {code: 402, message: "NOT_AUTHORIZED"}
            const limit = req.query.limit || 5
            const page  = req.query.page || 1
            const Fakturs = await Faktur.paginate({userId: req.jwt.id},
{
                                                    limit: limit,
                                                    page : page
                                                  })
            if(!Fakturs) {throw {code: 404, message: '_NOT_FOUND'}}
            return res.status(200)
                    .json({
                        status: true,
                        message: "_FOUND",
                        total: Fakturs.totalDocs,
                        Fakturs
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
            const result = Faktur.find({name: { regex: '.*' + item + '.*'
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
            
            const Faktur = await Faktur.create({})
            
            if(!Faktur){ throw { code: 500, message: 'FAILED_CREATED_'
        }
      }
            log = await Log.create({
              collection: 'Faktur',
              objectId: Faktur._id
      })
            return res.status(200)
                        .json({
                            status: true,
                            message: 'SUCCESS_CREATE_',
                            Faktur
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

            const Faktur = await Faktur.findOne({_id: req.params.id, userId: req.jwt.id
      })
            if(!Faktur) {throw {code: 404, message: '_NOT_FOUND'
        }
      }

            return res.status(200)
                    .json({
                        status: true,
                        message: `_FOUND`,
                        Faktur
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

            const Faktur = await Faktur.findOneAndUpdate({_id: req.params.id, userId: req.jwt.id
      }, req.body,
      { new: true
      })
            if(!Faktur) {throw {code: 400, message: 'Faktur_UPDATE_FAILED'
        }
      }

            return res.status(200)
                    .json({
                        status: true,
                        message: `Faktur_UPDATE_SUCCESS`,
                        Faktur
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

            const Faktur = await Faktur.findOneAndDelete({_id: req.params.id, userId: req.jwt.id
      })
            if(!Faktur) {throw {code: 400, message: 'Faktur_DELETE_FAILED'
        }
      }

            return res.status(200)
                    .json({
                        status: true,
                        message: `Faktur_DELETE_SUCCESS`,
                        Faktur
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

export default new FakturController()