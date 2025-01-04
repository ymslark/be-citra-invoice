import express from 'express'
import jwtAuth from "../middlewares/jwtAuth.js";
// import validateJSONBody from "../middlewares/validateJSONBody.js";
import checkPermission from "../middlewares/checkPermission.js"
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

var roles = ['super_admin', 'admin', 'developer']

const router = express.Router()

//Auth
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/refresh-token', AuthController.refreshToken)

//Form
router.get('/forms', jwtAuth(), FormController.index)
router.get('/forms/:id', jwtAuth(), FormController.show)
router.post('/forms', jwtAuth(), FormController.store)
router.get('/forms/:id/users', jwtAuth(), FormController.showToUser)
router.put('/forms/:id', jwtAuth(), FormController.update)
router.delete('/forms/:id', jwtAuth(), FormController.destroy)

//Question
// router.get('/forms', jwtAuth(), QuestionController.index)
router.get('/forms/:id/questions', jwtAuth(), QuestionController.index)
router.post('/forms/:id/questions', jwtAuth(), QuestionController.store)
router.put('/forms/:id/questions/:questionId', jwtAuth(), QuestionController.update)
router.delete('/forms/:id/questions/:questionId', jwtAuth(), QuestionController.destroy)


//Option
// router.get('/forms', jwtAuth(), QuestionController.index)
// router.get('/forms/:id/questions', jwtAuth(), QuestionController.index)
router.post('/forms/:id/questions/:questionId/options', jwtAuth(), OptionController.store)
router.put('/forms/:id/questions/:questionId/options/:optionId', jwtAuth(), OptionController.update)
router.delete('/forms/:id/questions/:questionId/options/:optionId', jwtAuth(), OptionController.destroy)


//Answer
router.post('/answers/:formId', jwtAuth(), AnswerController.store)
// router.put('/forms/:id/questions/:questionId/options/:optionId', jwtAuth(), OptionController.update)
// router.delete('/forms/:id/questions/:questionId/options/:optionId', jwtAuth(), OptionController.destroy)


//Response
router.get('/response/:formId/lists', jwtAuth(), ResponseController.lists)
router.get('/response/:formId/summaries', jwtAuth(), ResponseController.summaries)

//Invite
router.get('/forms/:id/invite', jwtAuth(), InviteController.index)
router.post('/forms/:id/invite', jwtAuth(), InviteController.store)
// router.get('/forms/:id/users', jwtAuth(), InviteController.showToUser)
// router.put('/forms/:id', jwtAuth(), InviteController.update)
router.delete('/forms/:id/invite', jwtAuth(), InviteController.destroy)

router.post('/supir', jwtAuth(), checkPermission(roles), SupirController.store)
router.get('/supir', jwtAuth(), checkPermission(roles), SupirController.index)
router.get('/supir/search/:keyword', jwtAuth(), checkPermission(roles), SupirController.search)
router.put('/supir/:id', jwtAuth(), checkPermission(roles), SupirController.update)
router.delete('/supir/:id', jwtAuth(), checkPermission(['super_admin', 'developer']), SupirController.destroy)
router.put('/supir/restore/:id', jwtAuth(), checkPermission(['super_admin', 'developer']), SupirController.restore)

// router.get('/CF/yyy', jwtAuth(), checkPermission(roles), CFController.anu)

router.get('/CF/search', jwtAuth(), checkPermission(roles), CFController.search)
router.get('/CF', jwtAuth(), checkPermission(roles), CFController.index)
router.get('/CF/:id', jwtAuth(), checkPermission(roles), CFController.show)
router.get('/CF/getDocumentsThisMonth', jwtAuth(), checkPermission(roles), CFController.getDocumentsThisMonth)
router.get('/CF/getDocumentsByPeriod', jwtAuth(), checkPermission(roles), CFController.getDocumentsByPeriod)
router.post('/CF', jwtAuth(), checkPermission(roles), CFController.store)
router.put('/CF/update/:id', jwtAuth(), checkPermission(roles), CFController.update)
router.put('/CF/restore/:id', jwtAuth(), checkPermission(roles), CFController.restore)
router.delete('/CF/:id', jwtAuth(), checkPermission(roles), CFController.destroy)

//
router.get('/SCI/search', jwtAuth(), checkPermission(roles), SCIController.search)
router.get('/SCI', jwtAuth(), checkPermission(roles), SCIController.index)
router.get('/SCI/detail/:id', jwtAuth(), checkPermission(roles), SCIController.show)
router.get('/SCI/getDocumentsThisMonth', jwtAuth(), checkPermission(roles), SCIController.getDocumentsThisMonth)
router.get('/SCI/getDocumentsByPeriod', jwtAuth(), checkPermission(roles), SCIController.getDocumentsByPeriod)
router.post('/SCI', jwtAuth(), checkPermission(roles), SCIController.store)
router.put('/SCI/update/:id', jwtAuth(), checkPermission(roles), SCIController.update)
router.put('/SCI/restore/:id', jwtAuth(), checkPermission(roles), SCIController.restore)
router.delete('/SCI/:id', jwtAuth(), checkPermission(roles), SCIController.destroy)


router.get('/CII/search', jwtAuth(), checkPermission(roles), CIIController.search)
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
// router.get('/Barang/detail/:id', jwtAuth(), checkPermission(roles), BarangController.show)
// router.get('/Barang/getDocumentsThisMonth', jwtAuth(), checkPermission(roles), BarangController.getDocumentsThisMonth)
// router.get('/Barang/getDocumentsByPeriod', jwtAuth(), checkPermission(roles), BarangController.getDocumentsByPeriod)
router.post('/Barang', jwtAuth(), checkPermission(['super_admin', 'developer']), BarangController.store)
router.put('/Barang/update/:id', jwtAuth(), checkPermission(roles), BarangController.update)
router.put('/Barang/restore/:id', jwtAuth(), checkPermission(['super_admin', 'developer']), BarangController.restore)
router.delete('/Barang/:id', jwtAuth(), checkPermission(['super_admin', 'developer']), BarangController.destroy)
// router.post

// router.delete('dev/destroy', jwtAuth(), checkPermission(['developer']), DevController.destroy)

export default router