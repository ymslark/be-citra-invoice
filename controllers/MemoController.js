import mongoose from "mongoose"
import Memo from '../models/Memo.js'
import Supir from '../models/Supir.js'
import storeLog from "../libraries/storeLog.js"
import checkProperty from "../libraries/checkProperty.js";
import checkMemoItem from "../libraries/checkMemoItem.js";

const statusAllowed = ['WAITING', 'PROCCESS', 'DONE', 'CANCEL']

class MemoController {
  async index(req,res){
    try {
      const limit = req.query.limit || 5
      const page  = req.query.page || 1
      let Memos = await Memo.paginate({ isActive : true},
                                    {
                                      sort: '_id: -1',
                                      limit: limit,
                                      page : page,
                                      populate: {path: 'id_supir', select: 'nama_supir no_hp no_kendaraan'}})
      Memos.docs = Memos.docs.map((memo) => ({
              ...memo.toObject(), // Convert ke object biasa
              supir: memo.id_supir, // Rename id_supir ke supir
              id_supir: undefined // Hapus field id_supir lama
            })) // Menghapus field id_supir                 
      if(!Memos) {throw {code: 404, message: 'DOCUMENT_NOT_FOUND'}}
      return res.status(200)
              .json({
                  status: true,
                  message: "DOCUMENT_FOUND",
                  total: Memos.totalDocs,
                  ...Memos})
    }catch(error){
            console.log(error)
            return res.status(error.code || 500)
                    .json({
                        status: false,
                        message: error.message
      })
    }
  }
  async deleted(req,res){
    try {
      const limit = req.query.limit || 5
      const page  = req.query.page || 1
      let Memos = await Memo.paginate({ isActive : false},
                                    {
                                      sort: '_id: -1',
                                      limit: limit,
                                      page : page,
                                      populate: {path: 'id_supir', select: 'nama_supir no_hp no_kendaraan'}})
      Memos.docs = Memos.docs.map((memo) => ({
              ...memo.toObject(), // Convert ke object biasa
              supir: memo.id_supir, // Rename id_supir ke supir
              id_supir: undefined // Hapus field id_supir lama
            })) // Menghapus field id_supir                 
      if(!Memos) {throw {code: 404, message: 'DOCUMENT_NOT_FOUND'}}
      return res.status(200)
              .json({
                  status: true,
                  message: "DOCUMENT_FOUND",
                  total: Memos.totalDocs,
                  ...Memos})
    }catch(error){
            console.log(error)
            return res.status(error.code || 500)
                    .json({
                        status: false,
                        message: error.message
      })
    }
  }

  async getDocumentsThisMonth(req,res){
    try {
      const date = new Date()
      let page = req.query.page || 1
      let limit = req.query.limit || 15
      var thisMonth = [date.getFullYear(), (date.getMonth() + 1)]
      console.log(thisMonth)
      const docs = await Memo.paginate({isActive:true,tanggal:{'$regex': thisMonth.join('-')}},
                                                { select: 'hal tujuan tanggal status',
                                                  sort: 'tanggal no_seri',
                                                  limit: limit,
                                                  page: page
                                                }
                                              )
      if(!docs) throw {code: 500, message: "SERVER_ERROR"}
      return res.status(200)
                .json({
                  status: true,
                  message: "",
                  data: docs
                })
    } catch (error) {
      return res.status(error.code || 500)
                  .json({
                    status: false,
                    message: error.message
                  })
    }
  }
  async getDocumentsByPeriod(req,res){
    try {
      var property = ['start_date', 'end_date']
      checkProperty(req.body, property)
      let limit = req.query.limit || 10
      let page = req.query.page || 1
      const docs = await Memo.paginate({isActive:true,tanggal:{'$gte': req.body.start_date, '$lte': req.body.end_date}},
                                      { select: 'tujuan tanggal status ',
                                        sort: 'tanggal no_seri',
                                        limit: limit,
                                        page: page
                                      }
      )
      console.log(req.body)
      if(!docs) throw {code:500, message: 'SERVER_ERROR'}
      return res.status(200)
                .json({
                  status: true,
                  message: "GET_PERIOD_SUCCESS",
                  data: docs
                })
    } catch (error) {
      return res.status(error.code || 500)
                  .json({
                    status: false,
                    message: error.message
                  })
    }
  }

  async search(req,res){
    try {
      console.log(req.query)
      if(!req.query.keyword) throw{code:402, message:'KEYWORD_REQUIRED'}
      let limit = req.query.limit || 10
      let page = req.query.page || 1
      const result = await Memo.find({isActive:true,tujuan: { '$regex': req.query.keyword, $options: 'i'}}).limit(5).sort({_id: -1})
      
      if(!result) throw{code:402, message:'SERVER_ERROR'}
      return res.status(200)
              .json({
                status: true,
                docs: result})
    } catch (error) {
      return res.status(error.code||500)
                .json({
                    status: false,
                    message: error.message})
    }
  }


  
  async store(req,res){
    try {
      let requiredProperty = ['tanggal', 'barang', 'alamat',  'tujuan', 'perusahaan','id_supir', 'jenis_memo']
      let checkedProperty = checkProperty(req.body,requiredProperty)
      if(!mongoose.Types.ObjectId.isValid(checkedProperty.id_supir)) throw {code: 404, message: 'INVALID_ID'}      
      let data = {...checkedProperty}
      if(!Array.isArray(data['barang'])) throw {code: 403, message:'BARANG_MUST_BE_ARRAY'}
      requiredProperty = ['nama_barang','keterangan','qty', 'ukuran']
      console.log(data['barang'])
      data['barang'] = checkMemoItem(data['barang'], requiredProperty)
      let data2 = {
        status:'WAITING',
        isActive:true 
      }
      console.log(data)    
      const memo = await Memo.create({
        ...data, ...data2
      })
  
      if(!Memo) throw { code: 500, message: 'MEMO_FAILED_CREATED'}

      const log = {
              koleksi: 'memos',
              note: "Menambahkan Data",
              userId: req.jwt.id,
              data_objectId: memo._id,
              data: memo
      }
      storeLog(log)
            return res.status(200)
                        .json({
                            status: true,
                            message: 'MEMO_CREATE_SUCCESS',
                            memo
      })
    } catch (error) {
      console.log(error)
                return res.status(error.code||500)
                            .json({
                                status: false,
                                message: error.message
      })
    }
  }

  async show(req,res){
    try {
      if(!req.params.id) throw {code: 400, message: 'REQUIRED_ID'}
      if(!mongoose.Types.ObjectId.isValid(req.params.id)) throw {code: 404, message: 'INVALID_ID'}

      let memo = await Memo.findOne({_id: req.params.id}).populate({path: 'id_supir', select: 'nama_supir no_hp no_kendaraan _id'}).select('-__v -createdAt -updatedAt')
      if(!memo) throw {code: 404, message: 'DOCUMENT_NOT_FOUND'}
      memo['supir'] = memo.id_supir // Rename id_supir to supir
      const result = memo.toObject()

      // // Ganti nama field
      result.supir = result.id_supir
      delete result.id_supir
      // memo.id_supir = undefined // Remove id_supir field
      console.log(memo)
      return res.status(200)
              .json({
                  status: true,
                  message: `DOCUMENT_FOUND`,
                  doc: result})
    }catch(error){
      return res.status(error.code || 500)
              .json({
                  status: false,
                  message: error.message})
    }
  }

  async update(req,res){
    try {
      if(!req.params.id) throw {code: 400, message: 'REQUIRED_ID'}
      let requiredProperty  = ['tanggal', 'barang', 'alamat',  'tujuan', 'perusahaan','id_supir', 'status', 'jenis_memo']
      if(!statusAllowed.includes(req.body.status)) throw {code: 403, message: 'STATUS_NOT_ALLOWED'}
      let checkedProperty   = checkProperty(req.body,requiredProperty)

      if(!mongoose.Types.ObjectId.isValid(checkedProperty.id_supir)) throw {code: 404, message: 'INVALID_ID'}      
      let data             = {...checkedProperty}
      if(!Array.isArray(data['barang'])) throw {code: 403, message:'BARANG_MUST_BE_ARRAY'}

      requiredProperty = ['nama_barang','keterangan','qty', 'ukuran']

      data['barang'] = checkMemoItem(data['barang'], requiredProperty)
      
      const memo = await Memo.findOneAndUpdate({_id: req.params.id},
        { 
        ...data
      }, {new: true})
  
      if(!memo) throw { code: 500, message: 'MEMO_FAILED_CREATED'}

      const log = {
              koleksi: 'memos',
              note: "Menambahkan Data",
              userId: req.jwt.id,
              data_objectId: memo._id,
              data: memo
      }
      storeLog(log)
            return res.status(200)
                        .json({
                            status: true,
                            message: 'MEMO_UPDATE_SUCCESS',
                            memo
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

  async destroy(req,res){
    try {
      if(!req.params.id) throw {code: 400, message: 'REQUIRED_ID'}
      if(!mongoose.Types.ObjectId.isValid(req.params.id))throw {code: 400, message: 'INVALID_ID'}

      const memo = await Memo.findOneAndUpdate({_id: req.params.id},{isActive:false},{new:true})
      if(!memo) throw {code: 400, message: 'MEMO_DELETE_FAILED'}
  
      const log = {
        koleksi: 'memos',
        note: "Menghapus Data",
        userId: req.jwt.id,
        data_objectId: memo._id,
        data: memo
      }
      storeLog(log)
      return res.status(200)
            .json({
                status: true,
                message: `MEMO_DELETE_SUCCESS`,
      })
    }catch(error){
            return res.status(error.code || 500)
                    .json({
                        status: false,
                        message: error.message,
      })
    }
  }
  async restore(req,res){
    try {
      if(!req.params.id) throw {code: 400, message: 'REQUIRED_ID'}
      if(!mongoose.Types.ObjectId.isValid(req.params.id))throw {code: 400, message: 'INVALID_ID'}

      const memo = await Memo.findOneAndUpdate({_id: req.params.id},{isActive:true},{new:true})
      if(!memo) throw {code: 400, message: 'MEMO_RESTORE_FAILED'}
  
      const log = {
        koleksi: 'memos',
        note: "me-restore Data",
        userId: req.jwt.id,
        data_objectId: memo._id,
        data: memo
      }
      storeLog(log)
      return res.status(200)
            .json({
                status: true,
                message: `MEMO_RESTORE_SUCCESS`,
                memo
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

export default new MemoController()