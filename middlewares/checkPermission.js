const checkPermission = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      console.log(req.jwt)
      // Pastikan req.user diisi sebelumnya oleh middleware otentikasi
      const userRole = req.jwt.role;

      if (!userRole) throw{code:401, message:"ROLE_REQUIRED"}


      // Contoh operasi asinkron (misalnya, validasi role dari database)
      // const isAllowed = await validateRole(userRole, allowedRoles);
      if (allowedRoles.includes(userRole)) {
          return next(); // Lanjutkan ke handler berikutnya
      }
      throw{code:401, message:"UNAUTHORIZED_ROLE"}
    } catch (error) {
      console.log(error)
                return res.status(error.code || 500)
                .json({
                    status:false, 
                    message: error.message
                })
    }
  }
  
}




export default checkPermission