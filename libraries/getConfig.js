
import Config from '../models/Config.js'
import dotenv from 'dotenv'

dotenv.config()
const env = process.env

const getConfig = async () => {
  const config = await Config.findOne({_id: env.CONFIG_ID}).select('ppn rekening')
  if(!config) return false 
  return config
}

export default getConfig
