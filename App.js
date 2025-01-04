import dotenv from 'dotenv'
import express from "express"
import apiRouter from './routes/api.js'
import connection from './connection.js'
import expressMonitor from 'express-status-monitor'
// import cors from 'cors'

const env = dotenv.config().parsed
const app = express()

app.use(expressMonitor())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// app.use(cors({origin: 'http://localhost:8000'}))
app.use('/', apiRouter)

//Handle 404 request
app.use((req,res) => {
    res.status(404).json({message: '404_NOT FOUND'})
})

//panggil fungsi mongodb connection
connection()

app.listen(env.APP_PORT, () => {
    console.log(`Server started on port ${env.APP_PORT}`);
});