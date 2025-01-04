
import Config from '../models/Config.js'
import dotenv from 'dotenv'

const env = dotenv.config().parsed

const getConfig = async () => {
  const config = await Config.findOne({_id: env.CONFIG_ID})
  if(!config) return false 
  return config
}

export default getConfig