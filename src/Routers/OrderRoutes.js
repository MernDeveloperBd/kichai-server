const express = require("express");
const OrderController = require("../controller/OrderController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const router = express.Router();

router.post('/', authMiddleware, OrderController.createOrder)
router.get('/user',authMiddleware, OrderController.getUserOrderHistory)
router.put('/:orderId/cancel',authMiddleware, OrderController.cancelOrder)
router.get('/:orderId',authMiddleware, OrderController.getOrderById)
router.get('/item/:orderItemId',authMiddleware, OrderController.getOrderItemById)



module.exports = router;