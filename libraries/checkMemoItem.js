const checkMemoItem = (barang) => {
  // if(model == "Supir"){
  let property = ['nama_barang', 'qty', 'keterangan']
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

export default checkMemoItem