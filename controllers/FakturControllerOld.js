import mongoose from "mongoose"
import Faktur from '../models/Faktur.js'
import CF from '../models/CF.js'
import SCI from '../models/SCI.js'
import CII from '../models/CII.js'
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileTypeFromFile } from 'file-type';

let perusahaan = ['CF', 'SCI', 'CII']

class FakturController {
  async index(req, res) {
    try {
      const limit = req.query.limit || 5
      const page = req.query.page || 1
      const Barangs = await Barang.paginate({ isActive: true }, {
        sort: '_id: -1',
        limit: limit,
        page: page
      })
      if (!Barangs) { throw { code: 404, message: 'BARANG_NOT_FOUND' } }
      return res.status(200)
        .json({
          status: true,
          message: "BARANG_FOUND",
          total: Barangs.totalDocs,
          Barangs
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

  async search(req, res) {
    try {
      if (!req.query.keyword) throw { code: 402, message: 'KEYWORD_REQUIRED' }
      let keyword = req.query.keyword
      const result = await Barang.find({ nama: { '$regex': keyword, $options: 'i' }, isActive: true }).sort({ _id: -1 }).limit(5)

      if (!result) throw { code: 500, message: 'FAILED_SEARCH_BARANG' }
      let message = false
      if (result.length == 0) message = 'BARANG_NOT_FOUND'
      return res.status(200)
        .json({
          status: true,
          message: message || "SUCCES_SEARCH_BARANG",
          item: result
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
      let reqProperty = ['nama', 'alamat', 'npwp', 'tanggal', 'nomorIdentitas', 'status']
      let data = checkProperty(req.body, reqProperty)
      console.log(data)
      const gambar = await this.uploadImage(req, res)
      if(!gambar) throw { code: 500, message: 'FAILED_UPLOAD_IMAGE' }

      const faktur = await Faktur.create({
        ...data
      })
      if (!faktur) throw { code: 500, message: 'FAILED_CREATED_BARANG' }

      let log = await Log.create({
        koleksi: 'barangs',
        note: "Menambahkan Data",
        userId: req.jwt.id,
        data_objectId: faktur._id,
        data: faktur
      })
      storeLog(log)
      return res.status(200)
        .json({
          status: true,
          message: 'SUCCESS_CREATE_BARANG',
          faktur
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

  async uploadImage(req, res) {
    try {
      // Cek apakah file ada
      if (!req.file) {
        return res.status(400).json({ message: 'File is required' });
      }

      // Cek jenis file
      console.log(req.file.path)
      console.log(req.file)
      
      const { ext } = await fileTypeFromFile(req.file.path);
      const allowedTypes = ['jpeg', 'jpg', 'png', 'gif'];

      if (!allowedTypes.includes(ext)) {
        return res.status(400).json({ message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.' });
      }

      // Tentukan path output untuk gambar yang dikompres
      const outputPath = path.join('uploads/compressed', `${Date.now()}.${ext}`);

      // Kompres gambar menggunakan sharp
      await sharp(req.file.path)
      .resize({ width: 600 }) // Resize jika perlu
      .toFormat(ext, { quality: 80 }) // Kompresi
      .toFile(outputPath);
      
      // Cek ukuran file
      const stats = fs.statSync(outputPath);
      if (stats.size > 200 * 1024) { // 200KB
        fs.unlinkSync(outputPath); // Hapus file jika melebihi ukuran
        return res.status(400).json({ message: 'Compressed image exceeds 200KB.' });
      }
      
      // Hapus file asli setelah kompresi
      // fs.unlinkSync(req.file.path);
      // console.log(path.extname)
      // console.log(path.basename)
      // console.log(path.dirname)
      // Kirim respons sukses
      res.status(201).json({ message: 'Image uploaded and compressed successfully', filePath: outputPath });
    } catch (error) {
      res.status(500).json({ message: 'Error processing image', error: error.message });
    }
  }

  uploadGambar(req, res){
    try {
      if (!req.file) {
        console.log('Tidak ada file yang diupload');
        return res.status(400).json({ message: 'Tidak ada file yang diupload' })
      }

      console.log(req.file)
      return res.status(200).json({
        message: 'Upload berhasil',
        filename: req.file.filename,
        path: `/uploads/faktur/${req.file.filename}`
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Terjadi kesalahan', error: error.message })
    }
  }
  
  async getSurat(req, res) {
    try {
      const no_seri = req.query.no_seri;

      if (!no_seri) throw { code: 400, message: 'NO_SERI_REQUIRED' }
      const companyCode = no_seri.split('/')[0]
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
        surat.barang = surat.interior.map(item => ({
          nama_barang: item.nama + (item.v1 + 'x', item.v2 + 'm'),
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
}

export default new FakturController()