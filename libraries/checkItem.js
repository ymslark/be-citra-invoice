const checkItem = (barang) => {
  // if(model == "Supir"){
  let property = ['nama_barang', 'qty', 'diskon_persen', 'diskon_nominal', 'harga']
  let data = []
  barang.forEach(i=>{
    let raw = {}
    property.forEach(v=> {
      if(i[v] == undefined) throw{code: 403, message: `${v.toUpperCase()}_REQUIRED`}
      // if(body[v] == 0)
      if(i[v] === 0) raw[v] = i[v]
      else if(i[v] == "" || i[v] === null || i[v] == []) throw{code: 403, message: `${v.toUpperCase()}_EMPTY`}
      
      raw[v] = i[v]
    });
    
    raw['total_harga'] = raw['qty'] * raw['harga']
    
    raw['total_diskon'] = 0
    
    if(raw['diskon_persen'] > 0) raw['total_diskon'] += (raw.total_harga / 100) * raw.diskon_persen
    
    if(raw['diskon_nominal'] > 0) raw['total_diskon'] += raw.diskon_nominal
    
    raw['harga_akhir'] = raw.total_harga - raw.total_diskon
    data.push(raw)
  })
  
  let seen = new Set()
  barang.some((item) => {
      if(seen.has(item.nama_barang)){
          throw {code: 403, message:'DUPLICATE_BARANG'}
      }
      seen.add(item.nama_barang)
  })



  return data
  }

// }

export default checkItem