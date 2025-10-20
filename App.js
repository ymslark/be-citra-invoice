import dotenv from 'dotenv'
import express from "express"
import apiRouter from './routes/api.js'
import connection from './connection.js'
import expressMonitor from 'express-status-monitor'
import cors from 'cors'
import multer from 'multer';
import upload from './middlewares/uploadMiddleware.js'
const router = express.Router();


import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(process.cwd());
const env = dotenv.config().parsed
const app = express()

app.use(cors({ origin: ['http://localhost:3000','http://localhost:8000', 'http://192.168.1.19:8000', 'https://demo.ortayamaesa.my.id'], Credentials: true }, ))
// app.use(cors({ origin: '*' }, ))
app.use(expressMonitor())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/public/images', express.static(path.join(process.cwd(), 'uploads/compressed')))
// app.use('/public', express.static(path.join(process.cwd(), 'uploads')))
console.log('Serving static from:', path.join(process.cwd(), 'uploads'))

app.use('/', apiRouter)

app.use((req,res) => {
    res.status(404).json({message: '404_NOT FOUND'})
})

  
app.use((err, req, res, next) => {
    // console.log(req)
    console.log('Error handler dijalankan');
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Upload error', error: err.message });
    } else if (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
    next();
});
//Handle 404 request

// Di bawah semua route





//panggil fungsi mongodb connection
connection()

app.listen(env.APP_PORT, () => {
    console.log(`Server started on port ${env.APP_PORT}`);
});
// if(error){
//     console.error('Failed to connect to MongoDB', error);
// }