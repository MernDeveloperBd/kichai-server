const jwtProvider = require("../../utils/jwtProvider.js");
const UserModal = require("../model/user/UserModel.js");

class UserService {
    async findUserProfileByJwt(jwt) {
        const email = jwtProvider.getEmailFromJwt(jwt)
        const user = await UserModal.findOne({ email })
        if (!user) {
            throw new Error(`User does not exists with email ${email} `)
        }
        return user;
    }

    // find user by email
    async findUserByEmail(email) {
        const user = await UserModal.findOne({ email })
        if (!user) {
            throw new Error(`User does not exists with email ${email} `)
        }
        return user;
    }
}

module.exports = new UserService()