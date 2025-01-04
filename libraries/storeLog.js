import mongoose from 'mongoose'
import Log from '../models/Log.js'

const storeLog = async (data) => {
  delete data.data._id
  const log = Log.create(data)

}



export default storeLog