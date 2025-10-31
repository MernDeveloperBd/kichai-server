const { default: mongoose } = require("mongoose");

const verificationCodeSchema = new mongoose.Schema({
    otp:{
        type: String
    },
    email:{
        type: String,
        required: true
    }
})

const VerificationCodeModal = mongoose.model('VerificationCode', verificationCodeSchema)
module.exports = VerificationCodeModal;