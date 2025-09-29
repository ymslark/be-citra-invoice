import mongoose from "mongoose"
import CII from '../models/CII.js'
import dayjs from "dayjs"
import storeLog from "../libraries/storeLog.js"
import Log from '../models/Log.js'
import Config from '../models/Config.js'
import getSerialNumber from '../libraries/getSerialNumber.js'
import getConfig from '../libraries/getConfig.js'
import checkProperty from "../libraries/checkProperty.js";
import checkInterior from "../libraries/checkInterior.js"

const statusAllowed = ['WAITING', 'PROCCESS', 'DONE', 'CANCEL']

class CIIController {
  async index(req,res){
    try {
      const limit = req.query.limit || 5
      const page  = req.query.page || 1
      const CIIs = await CII.paginate({isActive:true,},
                                    { select: '_id tujuan tanggal no_seri status',
                                      sort: 'no_seri',
                                      limit: limit,
                                      page : page })
      if(!CIIs) {throw {code: 404, message: 'DOCUMENT_NOT_FOUND'}}
      return res.status(200)
              .json({
                  status: true,
                  message: "DOCUMENT_FOUND",
                  total: CIIs.totalDocs,
                  ...CIIs})
    }catch(error){
            console.log(error)
            return res.status(error.code || 500)
                    .json({
                        status: false,
                        message: error.message
      })
    }
  }

  async documentLast30Days(req,res){
    try {
      
      const today = dayjs().format('YYYY-MM-DD');
      const thirtyDaysAgo = dayjs().subtract(30, 'day').format('YYYY-MM-DD');

      const limit = req.query.limit || 5
      const page  = req.query.page || 1
      const CIIs = await CII.paginate({ tanggal: { $gte: thirtyDaysAgo, $lte: today }, isActive:true},
                                    { select: '_id tujuan tanggal no_seri status',
                                      sort: {no_seri: -1},
                                      limit: limit,
                                      page : page })
      if(!CIIs) {throw {code: 404, message: 'DOCUMENT_NOT_FOUND'}}
      console.log(CIIs)
      return res.status(200)
              .json({
                  status: true,
                  message: "DOCUMENT_FOUND",
                  total: CIIs.totalDocs,
                  ...CIIs})
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
      const docs = await CII.paginate({isActive:true,tanggal:{'$regex': thisMonth.join('-')}},
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
      const docs = await CII.paginate({isActive:true,tanggal:{'$gte': req.body.start_date, '$lte': req.body.end_date}},
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
      const result = await CII.paginate({isActive:true,tujuan: { '$regex': req.query.keyword, $options: 'i'}},
                                        {
                                          sort: {date: 'desc'},
                                          limit : limit,
                                          page: page
                                        })
      
      if(!result) throw{code:402, message:'SERVER_ERROR'}
      return res.status(200)
              .json({
                status: true,
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
      var form = req.body
      let requiredProperty = ['tanggal', 'tujuan', 'tempo', 'hal',
                                'ppn','interior', 'instalasi', 'ongkos_kirim', 'no_hp']
      let checkedProperty = checkProperty(req.body,requiredProperty)      
      
      let data = {...checkedProperty}
      data['tanggal_tempo'] = req.body.tanggal_tempo
      data['catatan_tempo'] = req.body.catatan_tempo
      if(form.catatan) data['catatan'] = form.catatan


      requiredProperty = ['atas_nama','no_rekening','nama_bank', ]

      data['rekening']= checkProperty(form, requiredProperty)

      data['interior'] = checkInterior(form.interior)
      
      let no_seri = await getSerialNumber('CII', form.tanggal)
      
      if(!no_seri) throw {code: 500, message: 'SERVER_ERROR'}
      let data2 = {
        no_seri,
        status:'WAITING',
        isActive:true 
      }
      console.log(data)    
      const cii = await CII.create({
        ...data, ...data2
      })
  
      if(!CII) throw { code: 500, message: 'CII_FAILED_CREATED'}

      const log = {
              koleksi: 'ciis',
              note: "Menambahkan Data",
              userId: req.jwt.id,
              data_objectId: cii._id,
              data: cii
      }
      storeLog(log)
            return res.status(200)
                        .json({
                            status: true,
                            message: 'CII_CREATE_SUCCESS',
                            cii
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

      const cii = await CII.findOne({_id: req.params.id})
      if(!cii) throw {code: 404, message: 'DOCUMENT_NOT_FOUND'}
      
      return res.status(200)
              .json({
                  status: true,
                  message: `DOCUMENT_FOUND`,
                  doc: cii})
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
      if(!mongoose.Types.ObjectId.isValid(req.params.id)) throw {code: 400, message: 'INVALID_ID'}
      const doc = await CII.findOne({_id: req.params.id})
      if(!doc) throw {code: 400, message:'INVALID_ID'}
      var form = req.body
      let requiredProperty = ['tanggal', 'tujuan', 'tempo', 'hal',
                                'ppn','interior', 'instalasi', 'ongkos_kirim', 'status', 'no_hp']
      let checkedProperty = checkProperty(req.body,requiredProperty)      
      let data = {...checkedProperty}
      data['tanggal_tempo'] = req.body.tanggal_tempo
      data['catatan_tempo'] = req.body.catatan_tempo

      if(form.catatan) data['catatan'] = form.catatan

      if(!statusAllowed.includes(data.status)) throw {code: 403, message: 'WRONG_STATUS'}

      requiredProperty = ['atas_nama','no_rekening','nama_bank']

      data.rekening = checkProperty(form.rekening, requiredProperty)

      data['interior'] = checkInterior(form.interior)
      const cii = await CII.findOneAndUpdate({_id: req.params.id}, data, {new:true})
      console.log(data)    
          
      if(!cii) throw { code: 500, message: 'CII_UPDATE_FAILED'}
      const log = {
        koleksi: 'ciis',
        note: "Mengubah Data",
        userId: req.jwt.id,
        data_objectId: cii._id,
        data: cii
      }
      storeLog(log)

      return res.status(200)
              .json({
                  status: true,
                  message: `CII_UPDATE_SUCCESS`,
                  cii
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

      const cii = await CII.findOneAndUpdate({_id: req.params.id},{isActive:false},{new:true})
      if(!cii) throw {code: 400, message: 'CII_DELETE_FAILED'}
  
      const log = {
        koleksi: 'ciis',
        note: "Menghapus Data",
        userId: req.jwt.id,
        data_objectId: cii._id,
        data: cii
      }
      storeLog(log)
      return res.status(200)
            .json({
                status: true,
                message: `CII_DELETE_SUCCESS`,
                doc: cii
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

      const cii = await CII.findOneAndUpdate({_id: req.params.id},{isActive:true},{new:true})
      if(!cii) throw {code: 400, message: 'CII_RESTORE_FAILED'}
  
      const log = {
        koleksi: 'ciis',
        note: "me-restore Data",
        userId: req.jwt.id,
        data_objectId: cii._id,
        data: cii
      }
      storeLog(log)
      return res.status(200)
            .json({
                status: true,
                message: `CII_RESTORE_SUCCESS`,
      })
    }catch(error){
            return res.status(error.code || 500)
                    .json({
                        status: false,
                        message: error.message
      })
    }
  }

  async deletedIndex(req,res){
    try {
      const limit = req.query.limit || 5
      const page  = req.query.page || 1
      const CFs = await CII.paginate({isActive:false,},
                                    { select: '_id tujuan tanggal no_seri status',
                                      sort: 'no_seri',
                                      limit: limit,
                                      page : page })
      if(!CFs) {throw {code: 404, message: 'DOCUMENT_NOT_FOUND'}}
      return res.status(200)
              .json({
                  status: true,
                  message: "DOCUMENT_FOUND",
                  total: CFs.totalDocs,
                  ...CFs})
    }catch(error){
            console.log(error)
            return res.status(error.code || 500)
                    .json({
                        status: false,
                        message: error.message
      })
    }
  }
  // async anu(req,res){
  //   try {
  //     let data = {
  //       rekening: {
  //         cii: [
  //           {no_rekening:"7035622888", nama_bank: "BCA", atas_nama: "William Prayogo"},
  //           {no_rekening:"5222227071", nama_bank: "BCA", atas_nama: "PT. Sentral Citra Indonesia"},
  //           {no_rekening:"7035105557", nama_bank: "BCA", atas_nama: "CV. Mulia Utama Indonesia"},
  //         ],
  //         cii: [
  //           {no_rekening:"7035622888", nama_bank: "BCA", atas_nama: "William Prayogo"},
  //           {no_rekening:"5222227071", nama_bank: "BCA", atas_nama: "PT. Sentral Citra Indonesia"},
  //         ],
  //         sci: [
  //           {no_rekening:"5222227071", nama_bank: "BCA", atas_nama: "PT. Sentral Citra Indonesia"},
  //           {no_rekening:"7035105557", nama_bank: "BCA", atas_nama: "CV. Mulia Utama Indonesia"},
  //         ],
  //       }
  //     }
  //     console.log(data)
  //     const config = await Config.findOneAndUpdate({_id:'6769a0d6db3698d969b1c0c0'},data)
  //     if(!config) throw {code:400, message:'Gagal mengubah config'}
  //     return res.status(200)
  //           .json({
  //               status: true,
  //               message: `Berhasil`,
  //     })
  //   } catch (error) {
  //     console.log(error)
  //       return res.status(error.code || 500)
  //                           .json({
  //                               status: false,
  //                               message: error.message      
  //           })
  //  }
  // }
}

export default new CIIController()