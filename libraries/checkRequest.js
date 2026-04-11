const checkRequest = (item, perusahaan) => {

  let data = []
  if(perusahaan == "SCI" || perusahaan == "CF"){
    let property = ['nama_barang', 'qty']
    item.forEach(i=> {
      let raw = {}
      property.forEach(v=> {
        if (i[v] == undefined) throw { code: 403, message: `${v.toUpperCase()}_REQUIRED` }
        // if(body[v] == 0)
        if (i[v] === 0) raw[v] = i[v]
        else if (i[v] == "" || i[v] === null || i[v] == []) throw { code: 403, message: `${v.toUpperCase()}_EMPTY` }
        raw[v] = i[v]
      });
      data.push(raw)
    })
  }else if(perusahaan == "CII"){
    let property = ['nama_interior', 'v1', 'v2']
    item.forEach(i=> {
      let raw = {}
      property.forEach(v=> {
        if (i[v] == undefined) throw { code: 403, message: `${v.toUpperCase()}_REQUIRED` }
        // if(body[v] == 0)
        if (i[v] === 0) raw[v] = i[v]
        else if (i[v] == "" || i[v] === null || i[v] == []) throw { code: 403, message: `${v.toUpperCase()}_EMPTY` }
        raw[v] = i[v]
      });
      data.push(raw)
    })
  }
  console.log(data)
  return data
}

export default checkRequest;