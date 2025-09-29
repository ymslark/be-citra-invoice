import mongoose from "mongoose"
import Supir from '../models/Supir.js'
import Memo from '../models/Memo.js'
import Config from "../models/Config.js";
import storeLog from '../libraries/storeLog.js'
// import methodAuthorized  from "../libraries/methodAllowedRole.js";
import checkProperty from "../libraries/checkProperty.js";
import methodAllowedRole from "../libraries/methodAllowedRole.js";
class SupirController {

  async index(req,res){
      try {
          const limit = req.query.limit || 10
          const page  = req.query.page || 1
          // const supirs = await Supir.paginate({userId: req.jwt.id},
          //                                   {
          //                                     limit: limit,
          //                                     page : page
          //                                   })
          const supirs = await Supir.find({isActive: true}).select('nama_supir no_hp no_kendaraan _id')
          if(!supirs) {throw {code: 404, message: 'DRIVER_NOT_FOUND'}}
          return res.status(200)
                  .json({
                      status: true,
                      message: "DRIVER_FOUND",
                      supir : supirs
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
      // const config = await Config.deleteMany({})
      // if(!config) throw {message: 'CREATE_CONFIG_FAILED'}
      console.log(req.params.keyword)
      if(!req.params.keyword) throw {code: 400, message: 'REQUIRED_KEYWORD'}
      const result = await Supir.find({nama_supir: {'$regex': req.params.keyword, $options: 'i'}
          }).select('nama_supir no_hp no_kendaraan -_id')
      return res.status(200)
              .json({
                  status: true,
                  result
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
        var property = ['driver_name', 'driver_phone', 'vehicle_number']
        checkProperty(req.body,property)
        var data = {
            nama_supir: req.body.driver_name,
            no_hp:  req.body.driver_phone,
            no_kendaraan: req.body.vehicle_number,
            isActive: true
        }
        const supir = await Supir.create({
          ...data
        })

        if(!supir) throw { code: 500, message: 'DRIVER_FAILED_CREATED'}

        const log = {
          koleksi: 'supirs',
          note: "Menambahkan Data",
          userId: req.jwt.id,
          data_objectId: supir._id,
          data: supir
        }
        storeLog(log)
        return res.status(200)
                    .json({
                        status: true,
                        message: 'DRIVER_SUCCESS_CREATE',
                        supir
                        
    })
  } catch (error) {
    // console.log(error)
              return res.status(error.code||500)
                          .json({
                              status: false,
                              message: error.message
    })
  }
}

  async show(req,res){
   try {
    if(!req.params.id)throw {code: 400, message: 'REQUIRED_ID'}

    if(!mongoose.Types.ObjectId.isValid(req.params.id)) throw {code: 400, message: 'INVALID_ID'}
    const response = await Supir.findOne({_id: req.params.id})
    if(!response) throw {code: 404, message: 'DRIVER_NOT_FOUND'}
    console.log(response)

    let memos = await Memo.find({id_supir: req.params.id})
    if(!memos) memos = [] 
    return res.status(200)
            .json({
                status: true,
                message: 'DRIVER_FOUND',
                supir: response, 
                memo: memos
                })
   } catch (error) {
    return res.status(error.code || 500)
            .json({
                status: false,
                message: error.message
    })
   }
  }
  async update(req,res){

  try {
    if(!req.params.id)throw {code: 400, message: 'REQUIRED_ID'}

    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {throw {code: 400, message: 'INVALID_ID'}
  }
    var property = ['driver_name', 'driver_phone', 'vehicle_number']

    checkProperty(req.body,property)

    var data = {
        nama_supir: req.body.driver_name,
        no_hp:  req.body.driver_phone,
        no_kendaraan: req.body.vehicle_number,
    }
    const driver = await Supir.findOneAndUpdate({_id: req.params.id}, data,
                                                { new: true})
    if(!driver) throw {code: 400, message: 'DRIVER_UPDATE_FAILED'}
    
    const log = {
      koleksi: 'supirs',
      note: "Mengubah Data",
      userId: req.jwt.id,
      data_objectId: driver._id,
      data: driver
    }
    
    storeLog(log)
    
    return res.status(200)
            .json({
                status: true,
                message: `DRIVER_UPDATE_SUCCESS`,
                driver
  })
  }catch(error){
    console.log(req.body)
    return res.status(error.code || 500)
            .json({
                status: false,
                message: error.message,
    })
  }
}

  async destroy(req,res){
    try {
      if(!req.params.id)throw {code: 400, message: 'REQUIRED_ID'}

      if(!mongoose.Types.ObjectId.isValid(req.params.id))throw {code: 400, message: 'INVALID_ID'}

      const supir = await Supir.findOneAndUpdate({_id: req.params.id},{isActive:false},{new:true})
      if(!supir) throw {code: 400, message: 'DRIVER_DELETE_FAILED'}
  
      const log = {
        koleksi: 'supirs',
        note: "Menghapus Data",
        userId: req.jwt.id,
        data_objectId: supir._id,
        data: supir
      }
      
      storeLog(log)

      return res.status(200)
              .json({
                  status: true,
                  message: `DRIVER_DELETE_SUCCESS`,
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
  async restore(req,res){
    try {
      if(!req.params.id)throw {code: 400, message: 'REQUIRED_ID'}

      if(!mongoose.Types.ObjectId.isValid(req.params.id))throw {code: 400, message: 'INVALID_ID'}

      const supir = await Supir.findOneAndUpdate({_id: req.params.id},{isActive:true},{new:true})
      if(!supir) throw {code: 400, message: 'DRIVER_RESTORE_FAILED'}
  
      const log = {
        koleksi: 'supirs',
        note: "Menghapus Data",
        userId: req.jwt.id,
        data_objectId: supir._id,
        data: supir
      }
      
      storeLog(log)

      return res.status(200)
              .json({
                  status: true,
                  message: `DRIVER_RESTORE_SUCCESS`,
                  supir
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
}

export default new SupirController()