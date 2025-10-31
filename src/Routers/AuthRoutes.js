const express = require("express");
const authController = require("../controller/authController.js");
const router = express.Router();

router.post('/sent/login-signup-otp', authController.sendLoginOtp)
router.post('/signup', authController.createUser)
router.post('/signin', authController.signin)

module.exports = router;