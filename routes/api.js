import express from 'express'
//middlewares
import jwtAuth from "../middlewares/jwtAuth.js";
import upload from "../middlewares/uploadMiddleware.js"
import checkPermission from "../middlewares/checkPermission.js"

//Controllers
import AuthController from '../controllers/AuthController.js'
import FormController from '../controllers/FormController.js'
import QuestionController from '../controllers/QuestionController.js'
import OptionController from '../controllers/OptionController.js'
import AnswerController from '../controllers/AnswerController.js'
import ResponseController from '../controllers/ResponseController.js'
import InviteController from '../controllers/InviteController.js'
import SupirController from '../controllers/SupirController.js'
import CFController from '../controllers/CFController.js'
import SCIController from '../controllers/SCIController.js'
import CIIController from '../controllers/CIIController.js'
import BarangController from '../controllers/BarangController.js'
import MemoController from '../controllers/MemoController.js'
import RequestController from '../controllers/RequestController.js'
import FakturController from '../controllers/FakturController.js'
import ConfigController from '../controllers/ConfigController.js'

var roles = ['super_admin', 'admin', 'developer']

const router = express.Router()

//Auth
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/refresh-token', AuthController.refreshToken)


//config
router.get('/getConfig', CFController.getConfig)



//Form
// router.get('/forms', jwtAuth(), FormController.index)
// router.get('/forms/:id', jwtAuth(), FormController.show)
// router.post('/forms', jwtAuth(), FormController.store)
// router.get('/forms/:id/users', jwtAuth(), FormController.showToUser)
// router.put('/forms/:id', jwtAuth(), FormController.update)
// router.delete('/forms/:id', jwtAuth(), FormController.destroy)

//Question
// router.get('/forms', jwtAuth(), QuestionController.index)
// router.get('/forms/:id/questions', jwtAuth(), QuestionController.index)
// router.post('/forms/:id/questions', jwtAuth(), QuestionController.store)
// router.put('/forms/:id/questions/:questionId', jwtAuth(), QuestionController.update)
// router.delete('/forms/:id/questions/:questionId', jwtAuth(), QuestionController.destroy)


//Option
// router.get('/forms', jwtAuth(), QuestionController.index)
// router.get('/forms/:id/questions', jwtAuth(), QuestionController.index)
// router.post('/forms/:id/questions/:questionId/options', jwtAuth(), OptionController.store)
// router.put('/forms/:id/questions/:questionId/options/:optionId', jwtAuth(), OptionController.update)
// router.delete('/forms/:id/questions/:questionId/options/:optionId', jwtAuth(), OptionController.destroy)


//Answer
// router.post('/answers/:formId', jwtAuth(), AnswerController.store)
// router.put('/forms/:id/questions/:questionId/options/:optionId', jwtAuth(), OptionController.update)
// router.delete('/forms/:id/questions/:questionId/options/:optionId', jwtAuth(), OptionController.destroy)


// //Response
// router.get('/response/:formId/lists', jwtAuth(), ResponseController.lists)
// router.get('/response/:formId/summaries', jwtAuth(), ResponseController.summaries)

//Invite
// router.get('/forms/:id/invite', jwtAuth(), InviteController.index)
// router.post('/forms/:id/invite', jwtAuth(), InviteController.store)
// // router.get('/forms/:id/users', jwtAuth(), InviteController.showToUser)
// // router.put('/forms/:id', jwtAuth(), InviteController.update)
// router.delete('/forms/:id/invite', jwtAuth(), InviteController.destroy)

router.post('/supir', jwtAuth(), checkPermission(roles), SupirController.store)
router.get('/supir', jwtAuth(), checkPermission(roles), SupirController.index)
router.get('/supir/detail/:id', jwtAuth(), checkPermission(roles), SupirController.show)
router.get('/supir/search/:keyword', jwtAuth(), checkPermission(roles), SupirController.search)
router.put('/supir/:id', jwtAuth(), checkPermission(roles), SupirController.update)
router.delete('/supir/:id', jwtAuth(), checkPermission(['super_admin', 'developer']), SupirController.destroy)
router.put('/supir/restore/:id', jwtAuth(), checkPermission(['super_admin', 'developer']), SupirController.restore)


// router.get('/CF/yyy', jwtAuth(), checkPermission(roles), CFController.anu)
// router.get('/CF', jwtAuth(), checkPermission(roles), CFController.index)

router.get('/Config', jwtAuth(), checkPermission(roles), ConfigController.getConfig)
router.put('/Config', jwtAuth(), checkPermission(roles), ConfigController.update)


router.get('/CF', jwtAuth(), checkPermission(roles), CFController.index)
router.get('/CF/filterData', jwtAuth(), checkPermission(roles), CFController.filterData)
router.get('/CF/last30Days', jwtAuth(), checkPermission(roles), CFController.documentLast30Days)
router.get('/CF/deleted', jwtAuth(), checkPermission(roles), CFController.deletedIndex)
router.get('/CF/detail/:id', jwtAuth(), checkPermission(roles), CFController.show)
router.get('/CF/getDocumentsThisMonth', jwtAuth(), checkPermission(roles), CFController.getDocumentsThisMonth)
router.get('/CF/getDocumentsByPeriod', jwtAuth(), checkPermission(roles), CFController.getDocumentsByPeriod)
router.post('/CF', jwtAuth(), checkPermission(roles), CFController.store)
router.put('/CF/update/:id', jwtAuth(), checkPermission(roles), CFController.update)
router.patch('/CF/restore/:id', jwtAuth(), checkPermission(roles), CFController.restore)
router.delete('/CF/:id', jwtAuth(), checkPermission(roles), CFController.destroy)

router.get('/SCI', jwtAuth(), checkPermission(roles), SCIController.index)
router.get('/SCI/filterData', jwtAuth(), checkPermission(roles), SCIController.filterData)
router.get('/SCI/last30Days', jwtAuth(), checkPermission(roles), SCIController.documentLast30Days)
router.get('/SCI/deleted', jwtAuth(), checkPermission(roles), SCIController.deletedIndex)
router.get('/SCI/detail/:id', jwtAuth(), checkPermission(roles), SCIController.show)
router.get('/SCI/getDocumentsThisMonth', jwtAuth(), checkPermission(roles), SCIController.getDocumentsThisMonth)
router.get('/SCI/getDocumentsByPeriod', jwtAuth(), checkPermission(roles), SCIController.getDocumentsByPeriod)
router.post('/SCI', jwtAuth(), checkPermission(roles), SCIController.store)
router.put('/SCI/update/:id', jwtAuth(), checkPermission(roles), SCIController.update)
router.patch('/SCI/restore/:id', jwtAuth(), checkPermission(roles), SCIController.restore)
router.delete('/SCI/:id', jwtAuth(), checkPermission(roles), SCIController.destroy)

router.get('/CII/filterData', jwtAuth(), checkPermission(roles), CIIController.filterData)
router.get('/CII/search', jwtAuth(), checkPermission(roles), CIIController.search)
router.get('/CII/last30Days', jwtAuth(), checkPermission(roles), CIIController.documentLast30Days)
router.get('/CII', jwtAuth(), checkPermission(roles), CIIController.index)
router.get('/CII/detail/:id', jwtAuth(), checkPermission(roles), CIIController.show)
router.get('/CII/getDocumentsThisMonth', jwtAuth(), checkPermission(roles), CIIController.getDocumentsThisMonth)
router.get('/CII/getDocumentsByPeriod', jwtAuth(), checkPermission(roles), CIIController.getDocumentsByPeriod)
router.post('/CII', jwtAuth(), checkPermission(roles), CIIController.store)
router.put('/CII/update/:id', jwtAuth(), checkPermission(roles), CIIController.update)
router.put('/CII/restore/:id', jwtAuth(), checkPermission(roles), CIIController.restore)
router.delete('/CII/:id', jwtAuth(), checkPermission(roles), CIIController.destroy)


router.get('/Barang/search', jwtAuth(), checkPermission(roles), BarangController.search)
router.get('/Barang', jwtAuth(), checkPermission(roles), BarangController.index)
router.get('/Barang/getAll', jwtAuth(), checkPermission(roles), BarangController.getAll)
router.get('/CII/deleted', jwtAuth(), checkPermission(roles), CIIController.deletedIndex)
// router.get('/Barang/detail/:id', jwtAuth(), checkPermission(roles), BarangController.show)
// router.get('/Barang/getDocumentsThisMonth', jwtAuth(), checkPermission(roles), BarangController.getDocumentsThisMonth)
// router.get('/Barang/getDocumentsByPeriod', jwtAuth(), checkPermission(roles), BarangController.getDocumentsByPeriod)
router.post('/Barang', jwtAuth(), checkPermission(['super_admin', 'developer']), BarangController.store)
router.post('/Barang/bulkStore', jwtAuth(), checkPermission(['super_admin', 'developer']), BarangController.bulkStore)
router.put('/Barang/update/:id', jwtAuth(), checkPermission(roles), BarangController.update)
router.put('/Barang/restore/:id', jwtAuth(), checkPermission(['super_admin', 'developer']), BarangController.restore)
router.delete('/Barang/:id', jwtAuth(), checkPermission(['super_admin', 'developer']), BarangController.destroy)



router.get('/Memo/search', jwtAuth(), checkPermission(roles), MemoController.search)
router.get('/Memo', jwtAuth(), checkPermission(roles), MemoController.index)
router.get('/Memo/deleted', jwtAuth(), checkPermission(roles), MemoController.deleted)
router.get('/Memo/filterData', jwtAuth(), checkPermission(roles), MemoController.filterData)
router.get('/Memo/detail/:id', jwtAuth(), checkPermission(roles), MemoController.show)
// router.get('/Memo/getDocumentsThisMonth', jwtAuth(), checkPermission(roles), MemoController.getDocumentsThisMonth)
// router.get('/Memo/getDocumentsByPeriod', jwtAuth(), checkPermission(roles), MemoController.getDocumentsByPeriod)
router.post('/Memo', jwtAuth(), checkPermission(['super_admin', 'developer']), MemoController.store)
router.put('/Memo/update/:id', jwtAuth(), checkPermission(roles), MemoController.update)
router.patch('/Memo/restore/:id', jwtAuth(), checkPermission(['super_admin', 'developer']), MemoController.restore)
router.delete('/Memo/:id', jwtAuth(), checkPermission(['super_admin', 'developer']), MemoController.destroy)
// router.post



router.get('/Request/search/:perusahaan', jwtAuth(), checkPermission(roles), RequestController.search)
router.get('/Request/:perusahaan', jwtAuth(), checkPermission(roles), RequestController.filterData)
router.get('/Request/detail/:perusahaan/:id', jwtAuth(), checkPermission(roles), RequestController.show)
// router.get('/Request/getDocumentsThisMonth', jwtAuth(), checkPermission(roles), RequestController.getDocumentsThisMonth)
// router.get('/Request/getDocumentsByPeriod', jwtAuth(), checkPermission(roles), RequestController.getDocumentsByPeriod)
router.post('/Request/:perusahaan', RequestController.store)
router.put('/Request/update/:perusahaan/:id', jwtAuth(), checkPermission(roles), RequestController.update)
router.patch('/Request/status/:perusahaan/:id', jwtAuth(), checkPermission(roles), RequestController.updateStatus)
router.put('/Request/restore/:perusahaan/:id', jwtAuth(), checkPermission(['super_admin', 'developer']), RequestController.restore)
router.delete('/Request/:perusahaan/:id', jwtAuth(), checkPermission(['super_admin', 'developer']), RequestController.destroy)
// router.post


router.get('/Faktur/getSurat', FakturController.getSurat)
router.get('/Faktur', FakturController.index)
router.get('/Faktur/filterData', jwtAuth(), checkPermission(roles), FakturController.filterData)
router.delete('/Faktur/:id', jwtAuth(), checkPermission(['super_admin', 'admin', 'developer']), FakturController.destroy)
router.put('/Faktur/restore/:id', jwtAuth(), checkPermission(['super_admin', 'admin', 'developer']), FakturController.restore)
router.patch('/Faktur/status/:id', jwtAuth(), checkPermission(roles), FakturController.updateStatus)
// router.get('/Faktur/search', jwtAuth(), checkPermission(roles), FakturController.search)
// router.get('/Faktur/:perusahaan', jwtAuth(), checkPermission(roles), FakturController.index)
router.get('/Faktur/detail/:id', jwtAuth(), checkPermission(roles), FakturController.show)
router.put('/Faktur/:id', jwtAuth(), checkPermission(roles),upload.single('gambar'), FakturController.update)
// router.get('/Faktur/getDocumentsThisMonth', jwtAuth(), checkPermission(roles), FakturController.getDocumentsThisMonth)
// router.get('/Faktur/getDocumentsByPeriod', jwtAuth(), checkPermission(roles), FakturController.getDocumentsByPeriod)
router.post('/Faktur', upload.single('gambar'), FakturController.store)
// router.post('/Faktur/uploadImage', jwtAuth(), upload.single('gambar'), checkPermission(['super_admin', 'developer']), FakturController.uploadImage)
// router.post('/Faktur/:perusahaan', jwtAuth(), checkPermission(['super_admin', 'developer']), FakturController.store)
// router.put('/Faktur/update/:perusahaan/:id', jwtAuth(), checkPermission(roles), FakturController.update)
// router.put('/Faktur/restore/:perusahaan/:id', jwtAuth(), checkPermission(['super_admin', 'developer']), FakturController.restore)
// router.post


// router.delete('dev/destroy', jwtAuth(), checkPermission(['developer']), DevController.destroy)

export default router