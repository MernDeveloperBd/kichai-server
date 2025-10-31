const bcrypt = require('bcrypt');
const genereateOtp = require("../../utils/generateOtp");
const sendVerificatonEmail = require("../../utils/sendEmail");
const VerificationCodeModal = require("../model/verificationCode/verificationCodeModel");
const otpEmailTemplate = require("../../utils/emailTemplates/otpEmailTemplate"); // <-- ADD
const UserModal = require("../model/user/UserModel");
const CartModel = require('../model/cart/cartModel');
const jwtProvider = require('../../utils/jwtProvider');
const SellerService = require("./SellerService");
const UserService = require('./UserService');
const SellerModal = require('../seller/sellerModel');

class AuthService {
  /*  async sendLoginOtp(email) {
     const SIGNIN_PREFIX = "signin_";
     const actualEmail =
       typeof email === "string" && email.startsWith(SIGNIN_PREFIX)
         ? email.slice(SIGNIN_PREFIX.length)
         : email;
     
     const seller = await SellerService.getSellerByEmail(actualEmail);
     if (!seller) throw new Error("Seller not found");
 
     await VerificationCodeModal.deleteOne({ email: actualEmail }).catch(() => { });
     const otp = genereateOtp();
     await VerificationCodeModal.create({ otp, email: actualEmail });
 
     const subject = `${process.env.APP_NAME || "KI CHAI"} LOGIN OTP`;
 
     const html = otpEmailTemplate({
       otp,
       appName: process.env.APP_NAME || "KI CHAI",
       logoUrl: process.env.BRAND_LOGO_URL || "", // .env এ দিলে দেখাবে
       supportEmail: process.env.SUPPORT_EMAIL || process.env.ADMIN_APP_EMAIL || "",
       validity: Number(process.env.OTP_VALID_MINUTES) || 10,
       verifyUrl: process.env.CLIENT_URL
         ? `${process.env.CLIENT_URL}/verify-otp?email=${encodeURIComponent(actualEmail)}`
         : ""
     });
 
     await sendVerificatonEmail(actualEmail, subject, html);
   }
  */

  async sendLoginOtp(email) {
    const SIGNIN_PREFIX = "signin_";
    if (email.startsWith(SIGNIN_PREFIX)) {
      email = email.substring(SIGNIN_PREFIX.length)
      const seller = await SellerService.getSellerByEmail(email);
      const user = await UserService.findUserByEmail(email)
      if (!seller && !user) throw new Error("Seller not found");
    }
    const exitingVerificationCode = await VerificationCodeModal.findOne({ email })
    if (exitingVerificationCode) {
      await VerificationCodeModal.deleteOne({ email })
    }

    const otp = genereateOtp();
    const verificationCode = new VerificationCodeModal({ email, otp })
    await verificationCode.save()

    const subject = `${process.env.APP_NAME || "KI CHAI"} LOGIN OTP`;

    const html = otpEmailTemplate({
      otp,
      appName: process.env.APP_NAME || "KI CHAI",
      logoUrl: process.env.BRAND_LOGO_URL || "", // .env এ দিলে দেখাবে
      supportEmail: process.env.SUPPORT_EMAIL || process.env.ADMIN_APP_EMAIL || "",
      validity: Number(process.env.OTP_VALID_MINUTES) || 10,
      verifyUrl: process.env.CLIENT_URL
        ? `${process.env.CLIENT_URL}/verify-otp?email=${encodeURIComponent(email)}`
        : ""
    });

    await sendVerificatonEmail(email, subject, html);
  }
  // create user
  async createUser(req) {
    const { email, fullName, otp } = req;
    let user = await UserModal.findOne({ email })
    if (user) {
      throw new Error("User already exists with this email")
    }
    const verificationCode = await VerificationCodeModal.findOne({ email })
    if (!verificationCode || verificationCode.otp !== otp) {
      throw new Error("Invalid OTP...")
    }

    user = new UserModal({
      email, fullName
    })
    await user.save();
    const cart = new CartModel({ user: user._id })
    await cart.save()
    return jwtProvider.createJwt({ email })
  }

  // signin
  async signin(req) {
    const { email, otp } = req;
    const user = await UserModal.findOne({ email })
    if (!user) {
      throw new Error(`User not found with this email ${email}`)
    }
    const verificationCode = await VerificationCodeModal.findOne({ email })
    if (!verificationCode || verificationCode.otp !== otp) {
      throw new Error("Invalid OTP")
    }
    return {
      message: 'Login success',
      jwt: jwtProvider.createJwt({ email }),
      role: UserModal.role
    }

  }




}

module.exports = new AuthService();