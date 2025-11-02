const express = require("express");
const sellerMiddleware = require("../middleware/sellerAuthMiddleware.js");
const OrderController = require("../controller/OrderController");
const router = express.Router();


router.get('/',sellerMiddleware, OrderController.getSellerOrders)
router.patch('/:orderId/status/:orderStatus',sellerMiddleware, OrderController.updateOrderStatus)



module.exports = router;