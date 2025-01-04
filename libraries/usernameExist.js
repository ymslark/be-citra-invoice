import User from "../models/users.js"

const usernameExist = async (username) => {
        const user = await User.findOne({username: username})
        if(user) {return true}
        return false
}

export default usernameExist