export default async function uploadImage(req, res) {
  try {
    // Cek apakah ada file yang diupload
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'Tidak ada file yang diupload.' });
    }

    // Ambil file gambar dari request
    const gambarFaktur = req.files.gambar_faktur;
    const gambarNpwp = req.files.gambar_npwp;

    // Cek apakah file adalah gambar
    if (!gambarFaktur.mimetype.startsWith('image/') || !gambarNpwp.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'File yang diupload harus berupa gambar.' });
    }

    // Kembalikan path file yang diupload
    return res.status(200).json({
      status: true,
      message: 'Gambar berhasil diupload.',
      data: {
        gambarFaktur: gambarFaktur.path,
        gambarNpwp: gambarNpwp.path
      }
    });

    //return nama file yang diupload dan kembali ke controller
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mengupload gambar.', error: error.message });
  }
}