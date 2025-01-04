import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'

const env = dotenv.config().parsed

const jwtAuth = () =>{
    return async (req,res,next) =>{
        try {
            if(!req.headers.authorization){ throw {code:401, message: 'UNAUTHORIZED'}}
            const token = req.headers.authorization.split(' ')[1] //Bearer Token
            const verify = jsonwebtoken.verify(token, env.JWT_ACCESS_TOKEN_SECRET)
            req.jwt = verify
            req.jwt.id = verify.id
            req.jwt.role = verify.role
            
            next() //continue to another middleware / controller

        }catch(error){
            let errorJWT = {expired: "jwt expired", 
                            invalid: ["invalid signature",
                                        "jwt malformed",
                                        'jwt must be provided',
                                        'invalid token']}
            if (error.message == errorJWT.expired) { error.code = 401, error.message = "ACCESS_TOKEN_EXPIRED" }
            else if(errorJWT.invalid.includes(error.message)) { error.message = "INVALID_ACCESS_TOKEN" }
            return res.status(error.code || 500)
                            .json({
                                status: false,
                                message: error.message,
                            }) 
        }   

    }
}

export default jwtAuth