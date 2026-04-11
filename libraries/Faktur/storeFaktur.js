const storeFaktur = (req, res) => {
  //hanya kembalikan data yang sudah matang untuk diinsert ke database tanpa try catch
  const fields = ['nomorFaktur', 'tanggal', 'penjual', 'pembeli', 'barang', 'totalTanpaPpn', 'ppn', 'totalDenganPpn', 
                        'statusInternal', 'statusPajak', 'gambar_npwp', 'gambar_faktur', ]
  const fieldPenjual = ['nama', 'npwp', 'alamat']
  const fieldPembeli = ['nama', 'npwp', 'alamat', 'nomorIdentitas']
  const fieldbarang = ['nama', 'kuantitas', 'hargaSatuan', 'total']
  
  const reqProperty = ['nomorFaktur', 'tanggal', 'penjual', 'pembeli', 'barang', 'gambar_npwp', '',]
  const requiredFields = ['nomorFaktur', 'tanggal', 'penjual', 'pembeli', 'barang']
  const missing = requiredFields.filter(field => !req.body[field])
  if (missing.length > 0) {
    return res.status(400).json({ status: false, message: `Field wajib belum diisi: ${missing.join(', ')}` })
  }

  const { nomorFaktur, tanggal, penjual, pembeli, barang } = req.body
  let totalTanpaPpn = 0
  barang.forEach(item => {
    item.total = item.kuantitas * item.hargaSatuan
    totalTanpaPpn += item.total
  })
  const ppn = Math.round(totalTanpaPpn * 0.11)
  const totalDenganPpn = totalTanpaPpn + ppn
  
  const faktur = {
    nomorFaktur,
    tanggal,
    penjual,
    pembeli,
    barang,
    totalTanpaPpn,
    ppn,
    totalDenganPpn,
    statusInternal: 'PENDING',
    statusPajak: 'BELUM_TERBIT',
    gambar_npwp: req.files?.gambar_npwp?.[0]?.path || '',
    gambar_faktur: req.files?.gambar_faktur?.[0]?.path || ''
  }
}