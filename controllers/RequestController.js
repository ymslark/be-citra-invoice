import mongoose from "mongoose"
import ReqCF from '../models/ReqCF.js'
import ReqCII from '../models/ReqCII.js'
import ReqSCI from '../models/ReqSCI.js'
import storeLog from "../libraries/storeLog.js"
import checkProperty from "../libraries/checkProperty.js";
import checkItem from "../libraries/checkItem.js"
import checkRequest from "../libraries/checkRequest.js"
import getDate from "../libraries/getData/getDate.js"
import {buildFilterQuery} from "../libraries/db/buildFilterQuery.js"
const statusAllowed = ['WAITING', 'PROCCESS', 'DONE', 'CANCEL']

class RequestController {
  async index(req, res) {
    try {
      if (!req.params.perusahaan) throw { code: 400, message: 'REQUIRED_PERUSAHAAN' }
      let perusahaan = req.params.perusahaan
      let Model = null
      let data = null
      let requiredProperty = null
      switch (perusahaan) {
        case 'CII':
          Model = ReqCII
          break;
        case 'CF':
          Model = ReqCF
          break;
        case 'SCI':
          Model = ReqSCI
          break;
        default:
          throw { code: 404, message: '404_NOT_FOUND' }
          break;
      }
      const limit = req.query.limit || 50
      const page = req.query.page || 1
      const result = await Model.paginate({ isActive: true },
        {
          select: 'tujuan tanggal status',
          sort: { tanggal: desc },
          limit: limit,
          page: page
        })
      if (!result) throw { code: 500, message: 'SERVER_ERROR' }
      return res.status(200)
        .json({
          status: true,
          message: "DOCUMENT_FOUND",
          ...result          
        })
    } catch (error) {
      console.log(error)
      return res.status(error.code || 500)
        .json({
          status: false,
          message: error.message
        })
    }
  }

  async getDocumentsThisMonth(req, res) {
    try {
      const date = new Date()
      let page = req.query.page || 1
      let limit = req.query.limit || 15
      var thisMonth = [date.getFullYear(), (date.getMonth() + 1)]
      console.log(thisMonth)
      const docs = await CF.paginate({ isActive: true, tanggal: { '$regex': thisMonth.join('-') } },
        {
          select: 'hal tujuan tanggal status',
          sort: 'tanggal no_seri',
          limit: limit,
          page: page
        }
      )
      if (!docs) throw { code: 500, message: "SERVER_ERROR" }
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
  async getDocumentsByPeriod(req, res) {
    try {
      var property = ['start_date', 'end_date']
      checkProperty(req.body, property)
      let limit = req.query.limit || 10
      let page = req.query.page || 1
      const docs = await CF.paginate({ isActive: true, tanggal: { '$gte': req.body.start_date, '$lte': req.body.end_date } },
        {
          select: 'tujuan tanggal status ',
          sort: 'tanggal no_seri',
          limit: limit,
          page: page
        }
      )
      console.log(req.body)
      if (!docs) throw { code: 500, message: 'SERVER_ERROR' }
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

  async search(req, res) {
    try {
      if (!req.params.perusahaan) throw { code: 400, message: 'REQUIRED_PERUSAHAAN' }
      let perusahaan = req.params.perusahaan
      let Model = null
      let data = null
      let requiredProperty = null
      switch (perusahaan) {
        case 'CII':
          Model = ReqCII
          break;
        case 'CF':
          Model = ReqCF
          break;
        case 'SCI':
          Model = ReqSCI
          break;
        default:
          throw { code: 404, message: '404_NOT_FOUND' }
          break;
      }
      // console.log(req.query)
      if (!req.query.keyword) throw { code: 402, message: 'KEYWORD_REQUIRED' }
      let limit = req.query.limit || 10
      let page = req.query.page || 1
      const result = await Model.paginate({ isActive: true, tujuan: { '$regex': req.query.keyword, $options: 'i' } },
        {
          sort: { _id: -1 },
          limit: limit,
          page: page
        })

      if (!result) throw { code: 402, message: 'SERVER_ERROR' }
      return res.status(200)
        .json({
          status: true,
          message: result.totalDocs > 0 ? 'DOCUMENT_FOUND' : 'DOCUMENT_NOT_FOUND',
          docs: result
        })
    } catch (error) {
      return res.status(error.code || 500)
        .json({
          status: false,
          message: error.message
        })
    }
  }

  async store(req, res) {
    try {
      if(!req.params.perusahaan) throw {code: 400, message: 'REQUIRED_PERUSAHAAN'}
      let perusahaan = req.params.perusahaan
      let Model = null
      let data = null
      let requiredProperty = null
      switch (perusahaan) {
        case 'CII':
          Model = ReqCII
          break;
        case 'CF':
          Model = ReqCF
          break;
        case 'SCI':
          Model = ReqSCI
          break;
        default:
          throw { code: 404, message: '404_NOT_FOUND' }
          break;
      }
      
      if(perusahaan == 'CF' || perusahaan == 'SCI'){
        requiredProperty = ['tujuan', 'barang', 'alamat', 'no_hp']
        let checkedProperty = checkProperty(req.body, requiredProperty)
        data = { ...checkedProperty }

        data['barang'] = checkRequest(data['barang'], perusahaan)
      }else if(perusahaan == 'CII'){
        requiredProperty = ['tujuan', 'interior', 'alamat', 'no_hp']
        let checkedProperty = checkProperty(req.body, requiredProperty)
        data = { ...checkedProperty }

        data['interior'] = checkRequest(data['interior'], perusahaan)
      }
      console.log(getDate)
      let data2 = {
        tanggal: getDate,
        status: 'WAITING',
        isActive: true
      }
      console.log(data)
      const model = await Model.create({
        ...data, ...data2
      })

      if (!model) throw { code: 500, message: `REQUEST_${perusahaan}_FAILED_CREATED` }

      const log = {
        koleksi: `req${perusahaan.toLowerCase()}s`,
        note: "Menambahkan Data",
        data_objectId: model._id,
        data: model
      }
      storeLog(log)
      return res.status(200)
        .json({
          status: true,
          message: `REQUEST_${perusahaan}_CREATE_SUCCESS`,
          model
        })
    } catch (error) {
      console.log(error)
      return res.status(error.code || 500)
        .json({
          status: false,
          message: error.message
        })
    }
  }

  async show(req, res) {
    try {
      if (!req.params.id) throw { code: 400, message: 'REQUIRED_ID' }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw { code: 404, message: 'INVALID_ID' } 
      if (!req.params.perusahaan) throw { code: 400, message: 'REQUIRED_PERUSAHAAN' }
      let perusahaan = req.params.perusahaan
      let Model = null
      switch (perusahaan) {
        case 'CII':
          Model = ReqCII
          break;
        case 'CF':
          Model = ReqCF
          break;
        case 'SCI':
          Model = ReqSCI
          break;
        default:
          throw { code: 404, message: '404_NOT_FOUND' }
          break;
      }
      const request = await Model.findOne({ _id: req.params.id })
      if (!request) throw { code: 404, message: 'DOCUMENT_NOT_FOUND' }

      return res.status(200)
        .json({
          status: true,
          message: `DOCUMENT_FOUND`,
          doc: request
        })
    } catch (error) {
      return res.status(error.code || 500)
        .json({
          status: false,
          message: error.message
        })
    }
  }

  async update(req, res) {
    try {
      if (!req.params.perusahaan) throw { code: 400, message: 'REQUIRED_PERUSAHAAN' }
      if (!req.params.id) throw { code: 400, message: 'REQUIRED_ID' }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw { code: 400, message: 'INVALID_ID' }
      if (!req.query.status) throw { code: 400, message: 'REQUIRED_STATUS' }
      let statusAllowed = ['PENDING','APPROVED','REJECTED']
      if(!statusAllowed.includes(req.query.status)) throw {code: 400, message: 'INVALID_STATUS'}
      let perusahaan = req.params.perusahaan
      let Model = null
      let data = null
      let requiredProperty = null
      switch (perusahaan) {
        case 'CII':
          Model = ReqCII
          break;
        case 'CF':
          Model = ReqCF
          break;
        case 'SCI':
          Model = ReqSCI
          break;
        default:
          throw { code: 404, message: '404_NOT_FOUND' }
          break;
      }


      console.log(data)
      const model = await Model.findOneAndUpdate({isActive: true, _id: req.params.id}, {status: req.query.status}, {new: true})

      if (!model) throw { code: 500, message: `REQUEST_${perusahaan}_FAILED_CREATED` }

      const log = {
        koleksi: `req${perusahaan.toLowerCase()}s`,
        note: "Mengubah Data Status",
        userId: req.jwt.id,
        data_objectId: model._id,
        data: model
      }
      storeLog(log)
      return res.status(200)
        .json({
          status: true,
          message: `REQUEST_${perusahaan}_CREATE_SUCCESS`,
          model
        })
    } catch (error) {
      console.log(error)
      return res.status(error.code || 500)
        .json({
          status: false,
          message: error.message
        })
    }
  }

  async destroy(req, res) {
    try {
      if(!req.params.perusahaan) throw {code: 400, message: 'REQUIRED_PERUSAHAAN'}
      if (!req.params.id) throw { code: 400, message: 'REQUIRED_ID' }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw { code: 400, message: 'INVALID_ID' }
      let perusahaan = req.params.perusahaan
      let Model = null
      switch (perusahaan) {
        case 'CII':
          Model = ReqCII
          break;
        case 'CF':
          Model = ReqCF
          break;
        case 'SCI':
          Model = ReqSCI
          break;
        default:
          throw { code: 404, message: '404_NOT_FOUND' }
          break;
      }
      const model = await Model.findOneAndUpdate({ _id: req.params.id }, { isActive: false }, { new: true })
      if (!model) throw { code: 400, message: `${perusahaan}_REQUEST_DELETE_FAILED` }

      const log = {
        koleksi: `req${perusahaan.toLowerCase()}s`,
        note: "Menghapus Data",
        userId: req.jwt.id,
        data_objectId: model._id,
        data: model
      }
      storeLog(log)
      return res.status(200)
        .json({
          status: true,
          message: `${ perusahaan }_REQUEST_DELETE_SUCCESS`,
        })
    } catch (error) {
      return res.status(error.code || 500)
        .json({
          status: false,
          message: error.message,
        })
    }
  }
  async restore(req, res) {
    try {
      if (!req.params.perusahaan) throw { code: 400, message: 'REQUIRED_PERUSAHAAN' }
      if (!req.params.id) throw { code: 400, message: 'REQUIRED_ID' }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw { code: 400, message: 'INVALID_ID' }
      let perusahaan = req.params.perusahaan
      let Model = null
      switch (perusahaan) {
        case 'CII':
          Model = ReqCII
          break;
        case 'CF':
          Model = ReqCF
          break;
        case 'SCI':
          Model = ReqSCI
          break;
        default:
          throw { code: 404, message: '404_NOT_FOUND' }
          break;
      }
      const model = await Model.findOneAndUpdate({ _id: req.params.id }, { isActive: true }, { new: true })
      if (!model) throw { code: 400, message: `${perusahaan}_REQUEST_DELETE_FAILED` }

      const log = {
        koleksi: `req${perusahaan.toLowerCase()}s`,
        note: "Menghapus Data",
        userId: req.jwt.id,
        data_objectId: model._id,
        data: model
      }
      storeLog(log)
      return res.status(200)
        .json({
          status: true,
          message: `${perusahaan}_REQUEST_RESTORE_SUCCESS`,
        })
    } catch (error) {
      return res.status(error.code || 500)
        .json({
          status: false,
          message: error.message
        })
    }
  }

  async updateStatus(req,res){
    try{
      if(!req.params.perusahaan) throw {code: 400, message: 'REQUIRED_PERUSAHAAN'}
      if(!req.params.id) throw {code: 400, message: 'REQUIRED_ID'}
      if(!req.query.status) throw {code: 400, message: 'REQUIRED_STATUS'}
      let statusAllowed = ['PENDING', 'APPROVED', 'REJECTED']
      if(!statusAllowed.includes(req.query.status)) throw {code: 400, message: 'INVALID_STATUS'}
      let perusahaan = req.params.perusahaan
      let Model = null
      switch (perusahaan) {
        case 'CII':
          Model = ReqCII
          break;
        case 'CF':
          Model = ReqCF
          break;
        case 'SCI':
          Model = ReqSCI
          break;
        default:
          throw { code: 404, message: '404_NOT_FOUND' }
          break;
      }
      const model = await Model.findOneAndUpdate({isActive: true, _id: req.params.id}, {$set: {status: req.query.status}}, {new: true})
      if(!model) throw {code: 500, message: 'UPDATE_STATUS_FAILED'}
      return res.status(200)
        .json({
          status: true,
          message: 'UPDATE_STATUS_SUCCESS',
          model
        })
    }
    catch(error){
      console.log(error)
      return res.status(error.code || 500)
        .json({
          status: false,
          message: error.message,
        })
    }
  }
  
  async filterData(req, res) {
    try {
      if (!req.params.perusahaan) throw { code: 400, message: 'REQUIRED_PERUSAHAAN' }
      let perusahaan = req.params.perusahaan
      let Model = null
      let data = null
      let requiredProperty = null
      switch (perusahaan) {
        case 'CII':
          Model = ReqCII
          break;
        case 'CF':
          Model = ReqCF
          break;
        case 'SCI':
          Model = ReqSCI
          break;
        default:
          throw { code: 404, message: '404_NOT_FOUND' }
          break;
      }
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
  
      data = await Model.paginate(query, {
        select : '-__v -isActive -createdAt -updatedAt',
        page,
        limit,
        sort: { tanggal: 'desc' },
      });
      if (!data) throw {code: 402, message:'FAILED_FETCH_DATA_REQUEST_CF'}
      res.status(200).json({ 
                          status: true,
                          message: 'SUCCESS_FETCH_DATA_REQUEST_CF', 
                          ...data })
    } catch (error) {
      console.log(error)
      res.status(error.code || 500).json({ 
        status: false,
        message: error.message })
    }
  }
}

export default new RequestController()