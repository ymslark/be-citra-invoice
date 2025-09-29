const checkInterior = (interior) => {
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
    
    let volume = parseFloat(raw['v1']) * parseFloat(raw['v2'])
    volume = volume.toFixed(2)
    console.error(volume)
    // raw['total_harga_awal'] = raw['v1'] * raw['v2'] * parseFloat(raw['harga'])
  
    // raw['total_diskon'] = 0
    // raw['diskon'] = 0
    
    // if(raw['diskon_persen'] > 0) raw['diskon'] += 
    
    // if(raw['diskon_nominal'] > 0) raw['total_diskon'] += raw.diskon_nominal
    
    // raw['harga_akhir'] = raw.total_harga - raw.total_diskon
    // data.push(raw)

    raw['total_harga_awal'] = parseInt(volume * parseInt(raw['harga']))

    raw['diskon'] = 0
    raw['total_diskon'] = 0

    if (raw['diskon_persen'] > 0) raw['diskon'] += (raw.harga / 100) * raw.diskon_persen

    if (raw['diskon_nominal'] > 0) raw['diskon'] += raw.diskon_nominal
    raw['total_diskon'] = parseInt(raw.diskon * volume)
    raw['harga_akhir'] = raw.harga - raw.diskon
    raw['total_harga_akhir'] = parseInt(raw.harga_akhir * volume)
    data.push(raw)
  })
  

  let seen = new Set()
  data.some((item) => {
      if(seen.has(item.nama_interior)){
          throw {code: 403, message:'DUPLICATE_INTERIOR'}
      }
      seen.add(item.nama_interior)
  })


  console.log('hasil anu', data)
  return data
  }

// }

export default checkInterior