const express = require("express");
const router = express.Router();
const sellerController = require("../controller/seller/sellerController.js");
const sellerMiddleware = require("../middleware/sellerAuthMiddleware.js");

router.get("/profile", sellerMiddleware, sellerController.getSellerProfile)
router.post('/', sellerController.createSeller)
router.get('/', sellerController.getAllSellers)
router.patch('/',sellerMiddleware, sellerController.updateSeller)

router.post('/verify/login-otp', sellerController.verifyLoginOtp)

module.exports = router;