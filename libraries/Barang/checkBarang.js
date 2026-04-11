export const checkBarang = ((barangs, property) => {
  barangs.forEach(barang => {
    property.forEach(v => {
      if(barang[v] == undefined) throw{code: 403, message: `${v.toUpperCase()}_REQUIRED`}
      else if(barang[v] == "" || barang[v] < 0 || barang[v] == null || barang[v] == []) throw{code: 403, message: `${v.toUpperCase()}_EMPTY`}
    })
    return true
  })
})