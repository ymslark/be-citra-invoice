const checkProperty = (body,property) => {
  // if(model == "Supir"){
  console.log(body)
  let data = {}
    property.forEach(v=> {
      if(body[v] == undefined) throw{code: 403, message: `${v.toUpperCase()}_REQUIRED`}
      // if(body[v] == 0) 
      if(body[v] === 0 || body[v] === true || body[v] === false) data[v] = body[v]
      else if(body[v] == "" || body[v] < 0 || body[v] == null || body[v] == []) throw{code: 403, message: `${v.toUpperCase()}_EMPTY`}
      data[v] = body[v]
    });
  return data
  }

// }

export default checkProperty