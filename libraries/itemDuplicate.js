const itemDuplicate = (barang) => {
  
  let seen = new Set()
  let barang = []
  barang.some((item) => {
      if(seen.has(item.nama_barang)){
          // throw {code: 403, message:'DUPLICATE_BARANG'}
          throw {code: 400, message:'BARANG_DUPLICATE'}
      }
      seen.add(item.nama_barang)
      barang.push(item)
  })
  return barang
  
}

export default itemDuplicate 