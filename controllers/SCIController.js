import mongoose from "mongoose"
import dayjs from "dayjs"
import SCI from '../models/SCI.js'
import storeLog from "../libraries/storeLog.js"
import Log from '../models/Log.js'
import Config from '../models/Config.js'
import getDate from "../libraries/getData/getDate.js"
import getSerialNumber from '../libraries/getSerialNumber.js'
import getConfig from '../libraries/getConfig.js'
import checkProperty from "../libraries/checkProperty.js";
import checkItem from "../libraries/checkItem.js"
import { buildFilterQuery } from "../libraries/db/buildFilterQuery.js";

const statusAllowed = ['WAITING', 'PROCCESS', 'DONE', 'CANCEL']

class SCIController {
  async index(req,res){
    try {
      const limit = req.query.limit || 5
      const page  = req.query.page || 1
      const SCIs = await SCI.paginate({isActive:true,},
                                    { select: '_id tujuan tanggal no_seri status',
                                      sort: 'no_seri',
                                      limit: limit,
                                      page : page })
      if(!SCIs) {throw {code: 404, message: 'DOCUMENT_NOT_FOUND'}}
      return res.status(200)
              .json({
                  status: true,
                  message: "DOCUMENT_FOUND",
                  total: SCIs.totalDocs,
                  ...SCIs})
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
      const SCIs = await SCI.paginate({ tanggal: { $gte: thirtyDaysAgo, $lte: today }, isActive:true},
                                    { select: '_id tujuan tanggal no_seri status',
                                      sort: {no_seri: -1},
                                      limit: limit,
                                      page : page })
      if(!SCIs) {throw {code: 404, message: 'DOCUMENT_NOT_FOUND'}}
      console.log(SCIs)
      return res.status(200)
              .json({
                  status: true,
                  message: "DOCUMENT_FOUND",
                  total: SCIs.totalDocs,
                  ...SCIs})
    }catch(error){
            console.log(error)
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
      const SCIs = await SCI.paginate({isActive:false,},
                                    { select: '_id tujuan tanggal no_seri status',
                                      sort: 'no_seri',
                                      limit: limit,
                                      page : page })
      if(!SCIs) {throw {code: 404, message: 'DOCUMENT_NOT_FOUND'}}
      return res.status(200)
              .json({
                  status: true,
                  message: "DOCUMENT_FOUND",
                  total: SCIs.totalDocs,
                  ...SCIs})
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
      const docs = await SCI.paginate({isActive:true,tanggal:{'$regex': thisMonth.join('-')}},
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
      // throw {code: 400, message: 'REQUIRED_START_DATE_END_DATE'}
      let start_date = req.query.start_date || getDate
      let end_date = req.query.end_date || getDate
      if(!start_date && !end_date){
        start_date = getDate
        end_date = getDate
      }
      let limit = req.query.limit || 10
      let page = req.query.page || 1

      // if(req.query.keyword || req.query.keyword !== ''){
      //   const docs = await SCI.paginate({ isActive: true, tanggal: { '$gte': start_date, '$lt': end_date }, tujuan: { '$regex': req.query.keyword, $options: 'i' } },
      //                                   { select: 'tujuan tanggal status no_seri ',
      //                                     sort: 'tanggal no_seri',
      //                                     limit: limit,
      //                                     page: page
      //                                   })
      // }
      // else {
      // }
      const docs = await SCI.paginate({isActive:true,tanggal:{'$gte': start_date, '$lt': end_date}},
                                      { select: 'tujuan tanggal status no_seri ',
                                        sort: 'tanggal no_seri',
                                        limit: limit,
                                        page: page
                                      })
      console.log(req.body)
      if(!docs) throw {code:500, message: 'SERVER_ERROR'}
      return res.status(200)
                .json({
                  status: true,
                  message: "GET_PERIOD_SUCCESS",
                  docs
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
      const result = await SCI.paginate({isActive:true,tujuan: { '$regex': req.query.keyword, $options: 'i'}},
                                        {
                                          sort: {tanggal: 'desc', no_seri: 'desc'}, 
                                          limit : limit,
                                          page: page
                                        })
      
      if(!result) throw{code:402, message:'SERVER_ERROR'}
      return res.status(200)
              .json({
                status: true,
                ...result})
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
      console.log(form)
      let requiredProperty = ['tanggal', 'tujuan', 'tempo', 'hal',
                                'ppn','barang', 'instalasi', 'ongkos_kirim', 'no_hp']
      let checkedProperty = checkProperty(req.body,requiredProperty)      
      
      let data = {...checkedProperty}
      data['alamat'] = req.body.alamat || ''
      if(form.catatan) data['catatan'] = [form.catatan]


      requiredProperty = ['atas_nama','no_rekening','nama_bank' ]

      data.rekening = checkProperty(form, requiredProperty)

      data['barang'] = checkItem(form.barang)
      data.tanggal_tempo = form.tanggal_tempo
      data.catatan_tempo = form.catatan_tempo

      let no_seri = await getSerialNumber('SCI', form.tanggal)
      
      if(!no_seri) throw {code: 500, message: 'SERVER_ERROR'}
      let data2 = {
        no_seri,
        status:'WAITING',
        isActive:true 
      }
      console.log(data)    
      const sci = await SCI.create({
        ...data, ...data2
      })
  
      if(!SCI) throw { code: 500, message: 'SCI_FAILED_CREATED'}

      const log = {
              koleksi: 'scis',
              note: "Menambahkan Data",
              userId: req.jwt.id,
              data_objectId: sci._id,
              data: sci
      }
      storeLog(log)
            return res.status(200)
                        .json({
                            status: true,
                            message: 'SCI_CREATE_SUCCESS',
                            sci
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

      const sci = await SCI.findOne({_id: req.params.id}).select('-_id -__v -updatedAt -createdAt -total_diskon -total_harga -harga_akhir')
      if(!sci) throw {code: 404, message: 'DOCUMENT_NOT_FOUND'}
      
      return res.status(200)
              .json({
                  status: true,
                  message: `DOCUMENT_FOUND`,
                  doc: sci})
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
      const doc = await SCI.findOne({_id: req.params.id})
      if(!doc) throw {code: 400, message:'INVALID_ID'}
      var form = req.body
      let requiredProperty = ['tanggal', 'tujuan', 'tempo', 'hal',
                                'ppn','barang', 'instalasi', 'ongkos_kirim', 'status', 'rekening', 'no_hp']
      let checkedProperty = checkProperty(req.body,requiredProperty)      
      let data = {...checkedProperty, tanggal_tempo : form.tanggal_tempo,
        catatan_tempo: form.catatan_tempo}
      data['alamat'] = req.body.alamat || ''
      if(form.catatan) data['catatan'] = form.catatan

      if(!statusAllowed.includes(data.status)) throw {code: 403, message: 'WRONG_STATUS'}

      requiredProperty = ['atas_nama','no_rekening','nama_bank', ]

      data.rekening = checkProperty(form.rekening, requiredProperty)

      data['barang'] = checkItem(form.barang)
      const sci = await SCI.findOneAndUpdate({_id: req.params.id}, data, {new:true})
      console.log(data)    
          
      if(!sci) throw { code: 500, message: 'SCI_UPDATE_FAILED'}
      const log = {
        koleksi: 'scis',
        note: "Mengubah Data",
        userId: req.jwt.id,
        data_objectId: sci._id,
        data: sci
      }
      storeLog(log)

      return res.status(200)
              .json({
                  status: true,
                  message: `SCI_UPDATE_SUCCESS`,
                  sci
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

      const sci = await SCI.findOneAndUpdate({_id: req.params.id},{isActive:false},{new:true})
      if(!sci) throw {code: 400, message: 'SCI_DELETE_FAILED'}
  
      const log = {
        koleksi: 'scis',
        note: "Menghapus Data",
        userId: req.jwt.id,
        data_objectId: sci._id,
        data: sci
      }
      storeLog(log)
      return res.status(200)
            .json({
                status: true,
                message: `SCI_DELETE_SUCCESS`,
                doc: sci
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

      const sci = await SCI.findOneAndUpdate({_id: req.params.id},{isActive:true},{new:true})
      if(!sci) throw {code: 400, message: 'SCI_RESTORE_FAILED'}
  
      const log = {
        koleksi: 'scis',
        note: "me-restore Data",
        userId: req.jwt.id,
        data_objectId: sci._id,
        data: sci
      }
      storeLog(log)
      return res.status(200)
            .json({
                status: true,
                message: `SCI_RESTORE_SUCCESS`,
      })
    }catch(error){
            return res.status(error.code || 500)
                    .json({
                        status: false,
                        message: error.message
      })
    }
  }

  async getConfig(req,res){
    try {
      const config = await getConfig()
      if(!config) throw {code: 404, message: 'CONFIG_NOT_FOUND'}
      return res.status(200)
              .json({
                  status: true,
                  message: `CONFIG_FOUND`,
                  config})
    }catch(error){
      return res.status(error.code || 500)
              .json({
                  status: false,
                  message: error.message})
    }
  }

  async filterData(req, res) {
    try {
      const { search, startDate, endDate, page = 1, limit = 10, index = false } = req.query;
      // console.log(req.query)
      let defaultLast30Days = false;
      let order = 1
      if(index == 'true' || index === 'yes'){
        defaultLast30Days = true
        order = -1
      }
      const isActive = true
      const query = buildFilterQuery(
        { search, startDate, endDate },
        { searchFields: ['tujuan', 'no_seri'], defaultLast30Days, isActive }
      );
  
      const data = await SCI.paginate(query, {
        select : '-__v -isActive -createdAt -updatedAt',
        page,
        limit,
        sort: { no_seri: order },
      });
      if (!data) throw {code: 402, message:'FAILED_FETCH_DATA_SCI'}
      res.status(200).json({ 
                          status: true,
                          message: 'SUCCESS_FETCH_DATA_SCI', 
                          ...data })
    } catch (error) {
      console.log(error)
      res.status(error.code || 500).json({ 
        status: false,
        message: error.message })
    }
  }


  // async anu(req,res){
  //   try {
  //     let data = {
  //       rekening: {
  //         sci: [
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

export default new SCIController()