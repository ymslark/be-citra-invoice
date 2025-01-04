import mongoose from "mongoose"
import Barang from '../models/Barang.js'
import Log from '../models/Log.js'
import checkProperty from '../libraries/checkProperty.js'
import storeLog from '../libraries/storeLog.js'
 
class BarangController {

  async index(req,res){
    try {
      const limit = req.query.limit || 5
      const page  = req.query.page || 1
      const Barangs = await Barang.paginate({isActive:true},{
                                              sort: '_id: -1',
                                              limit: limit,
                                              page : page
                                            })
      if(!Barangs) {throw {code: 404, message: 'BARANG_NOT_FOUND'}}
      return res.status(200)
              .json({
                  status: true,
                  message: "BARANG_FOUND",
                  total: Barangs.totalDocs,
                  Barangs})
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
      if(!req.query.keyword) throw{code:402, message:'KEYWORD_REQUIRED'}
      let keyword = req.query.keyword
      const result = await Barang.find({nama: { '$regex': keyword, $options: 'i'}, isActive:true}).sort({_id: -1}).limit(5)
      
      if(!result) throw {code:500, message: 'FAILED_SEARCH_BARANG'}
      let message = false
      if(result.length == 0) message = 'BARANG_NOT_FOUND'
      return res.status(200)
                .json({
                    status: true,
                    message: message || "SUCCES_SEARCH_BARANG",
                    item: result})
    } catch (error) {
      return res.status(error.code||500)
                      .json({
                          status: false,
                          message: error.message})
    }
  }

  async store(req,res){
    try {
      let reqProperty = ['nama', 'kode', 'satuan']
      let data = checkProperty(req.body, reqProperty)
      console.log(data)
      let checkKode = await Barang.find({kode: data.kode})
      if(checkKode.length > 0) throw { code: 500, message: 'KODE_BARANG_ALREADY_EXIST'}
      const barang = await Barang.create({
        ...data
      })
      if(!barang) throw { code: 500, message: 'FAILED_CREATED_BARANG'}

      let log = await Log.create({
              koleksi: 'barangs',
              note: "Menambahkan Data",
              userId: req.jwt.id,
              data_objectId: barang._id,
              data: barang
          })
      storeLog(log)
      return res.status(200)
                  .json({
                      status: true,
                      message: 'SUCCESS_CREATE_BARANG',
                      barang})
    } catch (error) {
      console.log(error)
      return res.status(error.code||500)
                  .json({
                      status: false,
                      message: error.message })
    }
  }

//     async show(req,res){
//         try {
//             if(!req.params.id){throw {code: 400, message: 'REQUIRED_ID'
//         }
//       }
//             if(!mongoose.Types.ObjectId.isValid(req.params.id)) {throw {code: 404, message: 'INVALID_ID'
//         }
//       }

//             const Barang = await Barang.findOne({_id: req.params.id, userId: req.jwt.id
//       })
//             if(!Barang) {throw {code: 404, message: '_NOT_FOUND'
//         }
//       }

//             return res.status(200)
//                     .json({
//                         status: true,
// ,
//                         message: 
// ,
//                         Barang
//       })
//     }catch(error){
//             return res.status(error.code || 500)
//                     .json({
//                         status: false,
//                         message: error.message
//       })
//     }
//   }

  async update(req,res){
    try {
      if(!mongoose.Types.ObjectId.isValid(req.params.id)) throw {code: 400, message: 'INVALID_ID'}
      let reqProperty = ['nama', 'kode', 'satuan']
      let data = checkProperty(req.body, reqProperty)
      console.log(data)

      let checkKode = await Barang.findOne({kode: data.kode})

      console.log(checkKode)

      let barang = ""

      if(!checkKode || checkKode._id == req.params.id ){
        barang = await Barang.findOneAndUpdate({_id: req.params.id},{...data}, {new:true})
      }else  throw { code: 500, message: 'KODE_BARANG_ALREADY_EXIST'}

      if(!barang) throw { code: 500, message: 'FAILED_UPDATE_BARANG'}
      let log = await Log.create({
              koleksi: 'barangs',
              note: "Mengubah Data",
              userId: req.jwt.id,
              data_objectId: barang._id,
              data: barang
          })
      storeLog(log)
      return res.status(200)
                  .json({
                      status: true,
                      message: 'SUCCESS_UPDATE_BARANG',
                      barang})
    } catch (error) {
    console.log(error)
    return res.status(error.code||500)
                .json({
                    status: false,
                    message: error.message })
    }
  }

  async destroy(req,res){
    try {
      if(!req.params.id) throw {code: 400, message: 'REQUIRED_ID'}
      if(!mongoose.Types.ObjectId.isValid(req.params.id)) throw {code: 400, message: 'INVALID_ID'}
      const barang = await Barang.findOneAndUpdate({_id: req.params.id},{isActive: false}, {new: true})
      console.log(barang)
      if(!barang) throw {code: 400, message: 'BARANG_DELETE_FAILED'}
      return res.status(200)
              .json({
                  status: true,
                  message: `BARANG_DELETE_SUCCESS`,
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
      if(!req.params.id) throw {code: 400, message: 'REQUIRED_ID'}
      if(!mongoose.Types.ObjectId.isValid(req.params.id))throw {code: 400, message: 'INVALID_ID'}

      const barang = await Barang.findOneAndUpdate({_id: req.params.id},{isActive:true},{new:true})
      if(!barang) throw {code: 400, message: 'BARANG_RESTORE_FAILED'}
  
      const log = {
        koleksi: 'barangs',
        note: "me-restore Data",
        userId: req.jwt.id,
        data_objectId: barang._id,
        data: barang
      }
      storeLog(log)
      return res.status(200)
            .json({
                status: true,
                message: `BARANG_RESTORE_SUCCESS`,
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

export default new BarangController()