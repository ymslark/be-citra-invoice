const checkItem = (barang) => {
  // if(model == "Supir"){
  let property = ['nama_barang', 'qty', 'diskon_persen', 'diskon_nominal', 'harga']
  let data = []
  barang.forEach(( item, index )=>{
    barang[index].qty = parseInt(item.qty)
    barang[index].diskon_persen = parseInt(item.diskon_persen)
    barang[index].diskon_nominal = parseInt(item.diskon_nominal)
    barang[index].harga = parseInt(item.harga)
  })
  barang.forEach(i=>{
    let raw = {}
    property.forEach(v=> {
      if(i[v] == undefined) throw{code: 403, message: `${v.toUpperCase()}_REQUIRED`}
      // if(body[v] == 0)
      if(i[v] == 0) raw[v] = i[v]
      else if(i[v] == "" || i[v] === null || i[v] == []) throw{code: 403, message: `${v.toUpperCase()}_EMPTY`}
      
      raw[v] = i[v]
    });
    
    raw['total_harga_awal'] = raw['qty'] * raw['harga']
    
    raw['diskon'] = 0
    raw['total_diskon'] = 0
  
    if(raw['diskon_persen'] > 0) raw['diskon'] += (raw.harga / 100) * raw.diskon_persen
    
    if(raw['diskon_nominal'] > 0) raw['diskon'] += raw.diskon_nominal
    raw['total_diskon'] = raw.diskon * raw.qty
    raw['harga_akhir'] = raw.harga - raw.diskon
    raw['total_harga_akhir'] = raw.harga_akhir * raw.qty
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