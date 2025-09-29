import Config from '../models/Config.js'
import getConfig from '../libraries/getConfig.js'
import checkProperty from '../libraries/checkProperty.js'
class ConfigController{
  async getConfig(req,res){
    try {
      const config = await getConfig()
      return res.status(200)
                .json({
                  status: true,
                  message: "GET_CONFIG_SUCCESS",
                  config
                })
    } catch (error) {
      return res.status(error.code || 500)
                  .json({
                    status: false,
                    message: error.message
                  })
    }
  }

  async update(req,res){
    try {
      let requiredProperty = ['rekening', 'ppn']
      let data = checkProperty(req.body, requiredProperty)
      const config = await getConfig()
      if(!config) throw {code: 500, message: 'GET_CONFIG_FAILED'}

      const updateConfig = await Config.findOneAndUpdate({ _id: config._id}, data, { new: true })
      if(!updateConfig) throw {code:400, message: 'UPDATE_CONFIG_FAILED'}
      return res.status(200)
                .json({
                  status: true,
                  message: "UPDATE_CONFIG_SUCCESS",
                  config: updateConfig
                })
    } catch (error) {
      
      return res.status(error.code || 500)
                  .json({
                    status: false,
                    message: error.message
                  })
    }
  }
}

export default new ConfigController()