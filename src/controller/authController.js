const UserRoles = require("../Domain/userRole.js");
const AuthService = require("../service/AuthService.js");

class AuthController {
    async sendLoginOtp(req, res) {
        try {
            const email = req.body.email;
            await AuthService.sendLoginOtp(email)
            return res.status(200).json({ message: "OTP send successfully" })
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500)
                .json({ message: error.message })
        }
    }

    // create user
    async createUser(req, res) {
        try {
            const jwt = await AuthService.createUser(req.body)
            const authResponse = {
                jwt, 
                message:"User create successfully",
                role: UserRoles.CUSTOMER
            }
            return res.status(200).json(authResponse)
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500)
                .json({ message: error.message })
        }
    }
    // signin user
    async signin(req, res) {
        try {
            const authResponse = await AuthService.signin(req.body)
          
            return res.status(200).json(authResponse)
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500)
                .json({ message: error.message })
        }
    }
}

module.exports = new AuthController()