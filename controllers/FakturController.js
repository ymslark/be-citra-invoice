// Faktur Controller - CRUD Faktur Pajak Berbasis Kelas
import Faktur from '../models/Faktur.js'
import getDate from '../libraries/getData/getDate.js'
import Log from '../models/Log.js'
import checkProperty from '../libraries/checkProperty.js'
import getConfig from '../libraries/getConfig.js'
// import Faktur from '../models/Faktur.js'
import SCI from '../models/SCI.js'
import CF from '../models/CF.js'
import CII from '../models/CII.js'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileTypeFromFile } from 'file-type'

import { buildFilterQuery } from "../libraries/db/buildFilterQuery.js";

import dotenv from 'dotenv'
import mongoose from 'mongoose'
const env = dotenv.config().parsed


const imageURLPath = (filename) => {
  return `${env.IMAGE_URL_PATH}${filename}`
}

let perusahaan = ['CF', 'SCI', 'CII']

class FakturController {
  async store(req, res) {
    try {
      const form = JSON.parse(req.body.faktur)

      let property = [ 'tanggal_pembelian', 'barang']
      // Validasi properti yang ada di model Faktur
      let data = checkProperty(form, property)
      data['tanggal'] = getDate
      property = ['nama_pembeli', 'alamat', 'npwp', 'no_hp']
      data['pembeli'] = checkProperty(form.pembeli, property)
      // Validasi gambar_npwp
      
      let filename = ``;
      // Validasi data yang diperlukan
      // console.log('masuk sini')      
//upload gambar_npwp
      if (!req.file) {
        return res.status(400).json({ message: 'File is required, udah sampe controller' });
      }

      // Dapatkan extension file dari fileType
      const { ext } = await fileTypeFromFile(req.file.path);
      const allowedTypes = ['jpeg', 'jpg', 'png', 'gif'];

      if (!allowedTypes.includes(ext)) {
        return res.status(400).json({ message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.' });
      }

      // Generate nama file output
      filename = `${Date.now()}.${ext}`;
      const outputPath = path.join('uploads/compressed', filename);

      // Kompres hanya jika size > 500KB
      if (req.file.size > 500 * 1024) {
        await sharp(req.file.path)
          .resize({ width: 600 })
          .toFormat(ext, { quality: 80 })
          .toFile(outputPath);
      } else {
        // Kalau tidak dikompres, pindahkan file asli ke compressed
        fs.renameSync(req.file.path, outputPath);
      }

      if(!filename || filename instanceof Error) throw { code: 400, message: filename.message || 'IMAGE_UPLOAD_FAILED' }
      data['pembeli']['gambar_npwp'] = outputPath
      console.log(data)
      const faktur = await Faktur.create({
        ...data,
        // gambar_faktur: req.files?.gambar_faktur?.[0]?.path || ''
      })

      // await Log.create({
      //   koleksi: 'fakturs',
      //   note: 'Membuat faktur pajak',
      //   userId: req.jwt.id,
      //   data_objectId: faktur._id,
      //   data: faktur
      // })
      
      return res.status(201).json({ status: true, message: 'CREATE_FAKTUR_SUCCESS', faktur})
    } catch (error) {
      console.log('gagal es')
      console.error('[ERROR CREATE FAKTUR]', error)
      return res.status(error.code || 500).json({ status: false, message: error.message || 'CREATE_FAKTUR_FAILED' })
    }
  }

  async index(req, res) {
    try {
      const fakturs = await Faktur.paginate({ isActive: true }, {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sort: { _id: -1 }
      })
      // .sort({ tanggal: -1 })
      return res.status(200).json({ status: true, fakturs })
    } catch (error) {
      console.error('[ERROR_GET_ALL_FAKTUR]', error)
      return res.status(500).json({ status: false, message: 'Gagal mengambil data faktur' })
    }
  }
  async search(req,res){
    try {
      console.log(req.query)
      if(!req.query.keyword) throw{code:402, message:'KEYWORD_REQUIRED'}
      let limit = req.query.limit || 10
      let page = req.query.page || 1
      const result = await Faktur.paginate({isActive:true, "pembeli.nama_pembeli": { '$regex': req.query.keyword, $options: 'i'}},
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
  async show(req, res) {
    try {
      if(!req.params.id) return res.status(400).json({ status: false, message: 'REQUIRED_ID' })
      if(mongoose.Types.ObjectId.isValid(req.params.id) == false) return res.status(400).json({ status: false, message: 'INVALID_ID' })
      let faktur = await Faktur.findById(req.params.id)
      if (!faktur) return res.status(404).json({ status: false, message: 'DOCUMENT_NOT_FOUND' })
      console.log(faktur)
      faktur.pembeli.gambar_npwp = `${env.BASE_URL}/${faktur.pembeli.gambar_npwp.replace('uploads/compressed/', 'public/images/')}`
      console.log(faktur.pembeli.gambar_npwp)

      return res.status(200).json({ status: true, faktur })
    } catch (error) {
      // console.error('[ERROR GET FAKTUR BY ID]', error)
      return res.status(500).json({ status: false, message: error.message || 'Gagal mengambil data faktur' })
    }
  }

  async update(req, res) {
    try {
      if(!req.params.id) return res.status(400).json({ status: false, message: 'REQUIRED_ID' })
      if(mongoose.Types.ObjectId.isValid(req.params.id) == false) throw ({ code:401, message: 'INVALID_ID' })
      const faktur = await Faktur.findById(req.params.id)
      if (!faktur) throw { status: false, message: 'FAKTUR_NOT_FOUND' }
      const form = JSON.parse(req.body.faktur)
      let property = ['tanggal', 'tanggal_pembelian', 'barang', 'status']
      // Validasi properti yang ada di model Faktur
      let data = checkProperty(form, property)
      data['tanggal'] = form.tanggal
      property = ['nama_pembeli', 'alamat', 'npwp', 'no_hp']
      data['pembeli'] = checkProperty(form.pembeli, property)

      //data gambar_npwp ambil dari db dulu, kalo ada yang baru timpa, kalo gaada pake yang lama
      data['pembeli']['gambar_npwp'] = faktur.pembeli.gambar_npwp

      //upload gambar_npwp
      let filename = ``;
      let finalPath = ``
      console.log(req.file)
      if (req.file) {
        console.log('masuk controller')
        
      // Dapatkan extension file dari fileType
      const { ext } = await fileTypeFromFile(req.file.path);
      const allowedTypes = ['jpeg', 'jpg', 'png', 'gif'];

      if (!allowedTypes.includes(ext)) {
        return res.status(400).json({ message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.' });
      }
      
      // Generate nama file output
      filename = `${Date.now()}.${ext}`;
      const outputPath = path.join('uploads/compressed', filename);
      
      // Kompres hanya jika size > 500KB
      if (req.file.size > 500 * 1024) {
        await sharp(req.file.path)
          .resize({ width: 600 })
          .toFormat(ext, { quality: 80 })
          .toFile(outputPath);
      } else {
        // Kalau tidak dikompres, pindahkan file asli ke compressed
        fs.renameSync(req.file.path, outputPath);
      }
      console.log("output path", outputPath)
      if(!filename || filename instanceof Error) throw { code: 400, message: filename.message || 'IMAGE_UPLOAD_FAILED' }
      finalPath = outputPath      // Object.assign(faktur, req.body)
      if(finalPath && finalPath != '') data['pembeli']['gambar_npwp'] = finalPath
      }
      console.log(data)
      const updateFaktur = await Faktur.findByIdAndUpdate(req.params.id, data, { new: true })
      console.log('update faktur', updateFaktur)
      if (!updateFaktur) throw { code: 401, message: 'FAILED_UPDATE_FAKTUR' }

      await Log.create({
        koleksi: 'fakturs',
        note: 'Memperbarui faktur pajak',
        userId: req.jwt.id,
        data_objectId: faktur._id,
        data: faktur
      })

      return res.status(200).json({ status: true, message: 'UPDATE_FAKTUR_SUCCESS', faktur })
    } catch (error) {
      console.error('[ERROR UPDATE FAKTUR]', error)
      return res.status(500).json({ status: false, message: error.message })
    }
  }

  async destroy(req, res) {
    try {
      if(!req.params.id) return res.status(400).json({ status: false, message: 'REQUIRED_ID' })
      if(mongoose.Types.ObjectId.isValid(req.params.id) == false) throw ({ code:401, message: 'INVALID_ID' })

      const faktur = await Faktur.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
      if (!faktur) return res.status(404).json({ status: false, message: 'Faktur tidak ditemukan' })

      await Log.create({
        koleksi: 'fakturs',
        note: 'Menghapus faktur pajak',
        userId: req.jwt.id,
        data_objectId: faktur._id,
        data: faktur
      })

      return res.status(200).json({ status: true, message: 'Faktur berhasil dihapus' })
    } catch (error) {
      console.error('[ERROR DELETE FAKTUR]', error)
      return res.status(500).json({ status: false, message: 'Gagal menghapus faktur' })
    }
  }
  async restore(req, res) {
    try {
      if(!req.params.id) return res.status(400).json({ status: false, message: 'REQUIRED_ID' })
      if(mongoose.Types.ObjectId.isValid(req.params.id) == false) throw ({ code:401, message: 'INVALID_ID' })

      const faktur = await Faktur.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true })
      if (!faktur) return res.status(404).json({ status: false, message: 'Faktur tidak ditemukan' })

      await Log.create({
        koleksi: 'fakturs',
        note: 'Menghapus faktur pajak',
        userId: req.jwt.id,
        data_objectId: faktur._id,
        data: faktur
      })

      return res.status(200).json({ status: true, message: 'Faktur berhasil direstore' })
    } catch (error) {
      console.error('[ERROR DELETE FAKTUR]', error)
      return res.status(500).json({ status: false, message: 'Gagal men-restore faktur' })
    }
  }

  async uploadImage(req,res) {
    try {
      console.log('masuk uploadImage controller')
      // Cek apakah file ada
      if (!req.file) {
        return res.status(400).json({ message: 'File is required, udah sampe controller' });
      }

      // Dapatkan extension file dari fileType
      const { ext } = await fileTypeFromFile(req.file.path);
      const allowedTypes = ['jpeg', 'jpg', 'png', 'gif'];

      if (!allowedTypes.includes(ext)) {
        return res.status(400).json({ message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.' });
      }

      // Generate nama file output
      const filename = `${Date.now()}.${ext}`;
      const outputPath = path.join('uploads/compressed', filename);

      // Kompres hanya jika size > 500KB
      if (req.file.size > 500 * 1024) {
        await sharp(req.file.path)
          .resize({ width: 600 })
          .toFormat(ext, { quality: 80 })
          .toFile(outputPath);
      } else {
        // Kalau tidak dikompres, pindahkan file asli ke compressed
        fs.renameSync(req.file.path, outputPath);
      }
      // return filename
      return  res.json({ status: true, message: 'Gambar berhasil diupload', filename, url: `/uploads/compressed/${filename}` });
    } catch (error) {
      return new Error('Gagal mengupload gambar: ' + error.message);
    }
  }


// async filterData(req, res) {
//   try {
//     const { search, startDate, endDate, page = 1, limit = 10, index = false } = req.query;

//     let defaultLast30Days = false;
//     if(index == 'true' || index === 'yes'){
//       defaultLast30Days = true
//     }
//     const query = buildFilterQuery(
//       { search, startDate, endDate },
//       { searchFields: ['pembeli.nama_pembeli'], defaultLast30Days}
//     );

//     const data = await Faktur.paginate(query, {
//       select : '-__v -isActive -createdAt -updatedAt',
//       page,
//       limit,
//       sort: { tanggal: -1 },
//     });
//     if (!data) throw {code: 402, message:'FAILED_FETCH_DATA_FAKTUR'}
//     res.status(200).json({ 
//                         status: true,
//                         message: 'SUCCESS_FETCH_DATA_FAKTUR', 
//                         ...data })
//   } catch (error) {
//     res.status(error.code || 500).json({ 
//       status: false,
//       message: error.message })
//   }
// }


  async getSurat(req, res) {
    try {
      const no_seri = req.query.no_seri;

      if (!no_seri || no_seri == '') throw { code: 400, message: 'REQUIRED_NO_SERI' }
      const companyCode = no_seri.split('/')[0]
      console.log(no_seri,companyCode)
      if (!perusahaan.includes(companyCode)) throw { code: 400, message: 'INVALID_NO_SERI' }
      let Model = null;

      switch (companyCode) {
        case 'CF':
          Model = CF;
          break;
        case 'SCI':
          Model = SCI;
          break;
        case 'CII':
          Model = CII;
          break;
        default:
          throw { code: 400, message: 'INVALID_COMPANY_CODE' }
      }


      let surat = await Model.findOne({ no_seri: no_seri, isActive: true });
      if (!surat) throw { code: 404, message: 'DOCUMENT_NOT_FOUND' }

      if( companyCode == 'CII'){
        surat = surat.toObject()
        surat['barang'] = surat.interior.map(item => ({
          nama_barang: item.nama_interior + ' ('+ item.v1 + 'x' + item.v2 + 'm)',
          harga: item.harga,
          qty: 1,
          diskon_persen: item.diskon_persen,
          diskon_nominal: item.diskon_nominal,
          total_harga: item.total_harga,
          total_diskon: item.diskon,
          harga_akhir: item.harga_akhir
        }))
        delete surat.interior
      }


      return res.status(200).json({
        status: true,
        message: 'SURAT_FOUND',
        surat
      });
    } catch (error) {
      console.error(error);
      return res.status(error.code || 500).json({
        status: false,
        message: error.message
      });
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
          { searchFields: ['pembeli.nama_pembeli'], defaultLast30Days, isActive }
        );
    
        const data = await Faktur.paginate(query, {
          select : '-__v -isActive -createdAt -updatedAt',
          page,
          limit,
          sort: { tanggal: order },
        });
        if (!data) throw {code: 402, message:'FAILED_FETCH_DATA_Faktur'}
        res.status(200).json({ 
                            status: true,
                            message: 'SUCCESS_FETCH_DATA_Faktur', 
                            ...data })
      } catch (error) {
        console.log(error)
        res.status(error.code || 500).json({ 
          status: false,
          message: error.message })
      }
    }

      async updateStatus(req,res){
    try{
      if(!req.params.id) throw {code: 400, message: 'REQUIRED_ID'}
      if(!req.query.status) throw {code: 400, message: 'REQUIRED_STATUS'}
      let statusAllowed = ['PENDING', 'APPROVED', 'REJECTED']
      if(!statusAllowed.includes(req.query.status)) throw {code: 400, message: 'INVALID_STATUS'}
      const model = await Faktur.findOneAndUpdate({isActive: true, _id: req.params.id}, {$set: {status: req.query.status}}, {new: true})
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
}

export default new FakturController()
