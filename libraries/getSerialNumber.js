import CF from '../models/CF.js'
import SCI from '../models/SCI.js'
import CII from '../models/CII.js'

const getSerialNumber = async (model, date) => {
  try {
    var romanNumber = ['','I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
    const dates = new Date()
    //YEAR, MONTH, DATE
    var splittedDate = date.split('-')
    var serialNumber = [ model, romanNumber[parseInt(splittedDate[1])], splittedDate[0] ]
    // console.log(romanNumber[month])
    // console.log(serialNumber)
    // var serialNumber = [model + '/' + splittedDate[1] + '/' + splittedDate[0] + '/']
    var recentSerialNumber = ''
    switch (model) {
      case 'CF':
        recentSerialNumber = await CF.find({no_seri: {'$regex': serialNumber.join('/'), }}).sort({_id: -1}).select('no_seri -_id').countDocuments()
        break;
      case 'SCI':
        recentSerialNumber = await SCI.find({no_seri: {'$regex': serialNumber.join('/'), }}).sort({_id: -1}).select('no_seri -_id').countDocuments()
        break;
      case 'CII':
        recentSerialNumber = await CII.find({no_seri: {'$regex': serialNumber.join('/'), }}).sort({_id: -1}).select('no_seri -_id').countDocuments()
        break;
    
      default:
        return false
        break;
    }

    // console.log(recentSerialNumber)
    // console.log((recentSerialNumber+1).toString().padStart(3,'0'))
    // if(!recentSerialNumber) return false

    serialNumber.push((recentSerialNumber+1).toString().padStart(3,'0'))

    return serialNumber.join('/')
    
  } catch (error) {
    return error
  }
}

export default getSerialNumber

