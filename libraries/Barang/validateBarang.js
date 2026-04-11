// validation.js
const checkProperty = (item, requiredProperties) => {
  for (let prop of requiredProperties) {
    if (!item.hasOwnProperty(prop)) {
      throw new Error(`Missing property: ${prop}`);
    }
  }
  return item;
};

export const validateBarang = async (items, requiredProperties, BarangModel) => {
  for (let item of items) {
    checkProperty(item, requiredProperties);

    // Cek apakah kode barang sudah ada
    let checkKode = await BarangModel.find({ kode: item.kode });
    if (checkKode.length > 0) {
      throw new Error(`KODE_BARANG_ALREADY_EXIST: ${item.kode}`);
    }
  }
};

