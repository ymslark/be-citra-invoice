// libraries/buildQuery.js
export function buildFilterQuery(params = {}, options = {}) {
  const { search, startDate, endDate, status, userId } = params;
  const { searchFields = [], defaultLast30Days = false, isActive = true } = options;

  let query = {};

  // 📅 Filter tanggal
  if (startDate || endDate) {
    query.tanggal = {};
    if (startDate) query.tanggal.$gte = startDate;
    if (endDate) query.tanggal.$lte = endDate;
  } else if (defaultLast30Days) {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Tambahkan 1 hari untuk memastikan tanggal akhir termasuk hari ini
    const end = today.toISOString().split("T")[0]; // hari ini (YYYY-MM-DD)
    const past30 = new Date(today);
    past30.setDate(past30.getDate() - 30);
    const start = past30.toISOString().split("T")[0];

    query.tanggal = { $gte: start, $lte: end };
  }
  if (isActive) query['isActive'] = true
  else query['isActive'] = false  
  // 🔎 Search dinamis
  if (search && searchFields.length > 0) {

    query.$or = searchFields.map((field) => ({
      [field]: { $regex: search, $options: "i" }
    }));
  }


  console.log(query);
  // ✅ Filter status
  if (status) query.status = status;

  // 👤 Filter user
  if (userId) query.user = userId;

  return query;
}
