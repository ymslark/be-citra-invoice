const checkItem = (interior) => {
  // if(model == "Supir"){
  let property = ['nama_interior', 'v1', 'v2', 'diskon_persen', 'diskon_nominal', 'harga']
  let data = []
  interior.forEach(i=>{
    let raw = {}
    property.forEach(v=> {
      if(i[v] == undefined) throw{code: 403, message: `${v.toUpperCase()}_REQUIRED`}
      // if(body[v] == 0)
      if(i[v] === 0) raw[v] = i[v]
      else if(i[v] == "" || i[v] === null || i[v] == []) throw{code: 403, message: `${v.toUpperCase()}_EMPTY`}
      
      raw[v] = i[v]
    });
    
    raw['total_harga'] = parseInt(Math.round(raw['v1'] * raw['v2'] * parseFloat(raw['harga'])))
    
    raw['total_diskon'] = 0
    
    if(raw['diskon_persen'] > 0) raw['total_diskon'] += parseInt(Math.ceil(raw.total_harga/ 100  / 100) * raw.diskon_persen * 100)
    
    if(raw['diskon_nominal'] > 0) raw['total_diskon'] += raw.diskon_nominal
    
    raw['harga_akhir'] = raw.total_harga - raw.total_diskon
    data.push(raw)
  })
  
  let seen = new Set()
  data.some((item) => {
      if(seen.has(item.nama_interior)){
          throw {code: 403, message:'DUPLICATE_INTERIOR'}
      }
      seen.add(item.nama_interior)
  })



  return data
  }

// }

export default checkItem