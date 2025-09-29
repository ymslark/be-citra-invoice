import dotenv from 'dotenv'
import User from '../models/User.js'
import emailExist from '../libraries/emailExist.js'
import usernameExist from '../libraries/usernameExist.js'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'

const env = dotenv.config().parsed

const generateAccessToken = async (payload) =>{
    return jsonwebtoken.sign(payload,
                            env.JWT_ACCESS_TOKEN_SECRET,
                            {expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME})
    }

const generateRefreshToken = async (payload) => {
    return jsonwebtoken.sign(payload,
                            env.JWT_REFRESH_TOKEN_SECRET,
                            {expiresIn: env.JWT_REFRESH_TOKEN_EXPIRATION_TIME})
    }

class AuthController {


    async register(req, res) {
            try {
                if(!req.body.fullname) {throw {code: 400, message: 'FULLNAME_IS_REQUIRED'}}
                // if(!req.body.email) {throw {code: 400, message: 'EMAIL_IS_REQUIRED'}}
                if(!req.body.password) {throw {code: 400, message: 'PASSWORD_IS_REQUIRED'}}
                if(req.body.password.length < 6) {throw {code: 400, message: 'PASSWORD_MINIMUM_6_CHARACTERS'}}

                // const isEmailExist = await emailExist(req.body.email)
                // if(isEmailExist) {throw {code:409, message: "EMAIL_ALREADY_EXIST"}}
                const isUsernameExist = await usernameExist(req.body.username)
                if(isUsernameExist) {throw {code:409, message: "USERNAME_ALREADY_EXIST"}}
                
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(req.body.password, salt)

                const user = await User.create({
                    fullname: req.body.fullname,
                    username: req.body.username,
                    email: "dssd",
                    role: req.body.role,
                    password: hash
                })
                if (!user) {throw ({code: 500, message: "USER_REGISTER_FAILED"})}

                const payload = {id: user.id, role:user.role}
                console.log(payload)

                const accessToken = await generateAccessToken(payload)
                const refreshToken = await generateRefreshToken(payload)

                return res.status(200)
                        .json({
                            status: true,
                            message: 'USER_REGISTER_SUCCESS',
                            accessToken,
                            refreshToken,
                            user: {
                                fullName: user.fullname,
                                role: user.role,
                            }
                        })
            } catch (error) {
                console.log(error)
                return res.status(error.code || 500)
                .json({
                    status:false, 
                    message: error.message
                })
            }
    }

    async login(req, res){
            try {
                //if(!req.body.email) { throw { code: 400, message: 'EMAIL_IS_REQUIRED'}}
                console.log(req.body)
                if(!req.body.username) { throw { code: 400, message: 'USERNAME_IS_REQUIRED'}}
                if(!req.body.password) { throw { code: 400, message: 'PASSWORD_IS_REQUIRED'}}
                
                const user = await User.findOne({username: req.body.username})
                if(!user){throw { code: 404, message: 'USER_NOT_FOUND'}}

                const isPasswordValid = await bcrypt.compareSync(req.body.password, user.password)
                if(!isPasswordValid){throw {code:400, message: 'INVALID_PASSWORD'}}

                const payload = {id: user._id, role:user.role}

                const accessToken = await generateAccessToken(payload)
                const refreshToken = await generateRefreshToken(payload)

                return res.status(200)
                            .json({
                                status: true,
                                message: 'USER_LOGIN_SUCCESS',
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                                user: {
                                    fullName: user.fullname,
                                    role: user.role,
                                }
                            })

            } catch (error) {
                return res.status(error.code || 500)
                            .json({
                                status: false,
                                message: error.message,
                            })                
            }
    }

    async refreshToken(req,res){
        try {
            if(!req.body.refreshToken){ throw { code:400, message:"REFRESH_TOKEN_IS_REQUIRED" } }

            //verify refresh token
            const verify = await jsonwebtoken.verify(req.body.refreshToken, env.JWT_REFRESH_TOKEN_SECRET)
            const user = await User.findOne({ _id: verify.id })
            console.log(verify)
            const payload = {id: verify.id, role:verify.role}
            
            const accessToken = await generateAccessToken(payload)
            const refreshToken = await generateRefreshToken(payload)

                return res.status(200)
                            .json({
                                status: true,
                                message: 'REFRESH_TOKEN_SUCCESS',
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                                user: {
                                    fullName: user.fullname,
                                    role: user.role,
                                }
                            })

        }
        catch(error){

            let errorMessage = {expired: "jwt expired", 
                                invalid: ["invalid signature",
                                            "jwt malformed",
                                            'jwt must be provided',
                                            'invalid token']}

            if (error.message == errorMessage.expired) { error.message = "REFRESH_TOKEN_EXPIRED" }
            else if(errorMessage.invalid.includes(error.message)) { error.message = "INVALID_REFRESH_TOKEN" }


            return res.status(error.code || 500)
                            .json({
                                status: false,
                                message: error.message,
                            }) 
        }
        
    
        }
}

export default new AuthController()