const jwtProvider = require("../../utils/jwtProvider.js");
const UserService = require("../service/UserService.js");


const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Invalid token. authorizaion failed" })
        }
        const token = authHeader.split(" ")[1]
        if (!token) {
            return res.status(401).json({ message: "Invalid token. authorizaion failed" })
        }
        let email = jwtProvider.getEmailFromJwt(token)
        const user = UserService.findUserByEmail(email)
        req.user = user;
        next()

    } catch (error) {
        return res.status(500)
            .json({ message: error.message })
    }
}

module.exports = authMiddleware;