const validateJSONBody = () => {
  return async (req, res, next) =>{
    try {
      // Mengecek apakah req.body adalah string JSON yang valid
      // console.log(res)
      // if (typeof req.body === 'string') {
      //   if(!JSON.parse(req.body)) throw {code:400, message:"INVALID_JSON"}; // Coba untuk parse JSON
      // }
      // Jika berhasil, lanjutkan ke middleware berikutnya
      next();
    } catch (error) {
      // Jika terjadi error, berarti JSON tidak valid
        // return res.status(500)
        //   .json({
        //       status:false, 
        //       message: "INVALID_JSON"
        //   })
        next()
    }
  }
};

export default validateJSONBody