const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

class JwtProvider {
    constructor(secretKey){
        this.secretKey=secretKey
    }
    createJwt(payload) {
        return jwt.sign(payload, this.secretKey, { expiresIn: '7d' })
    }

    getEmailFromJwt(token) {
        try {
            const decodedToken = jwt.verify(token, this.secretKey)
            return decodedToken.email
        } catch (error) {
            throw new Error("Invalid token")
        }
    }

    verifyJwt(token) {
        try {
            return jwt.verify(token, this.secretKey)
        } catch (error) {
            throw new Error("Invalid token")
        }
    }

}

module.exports = new JwtProvider(secretKey)