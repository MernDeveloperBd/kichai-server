const express = require("express");
const ProductController = require("../controller/ProductController.js");
const sellerMiddleware = require("../middleware/sellerAuthMiddleware.js");

const router = express.Router();

router.get("/", sellerMiddleware, ProductController.getProductsBySellerId)
router.post("/", sellerMiddleware, ProductController.createProduct)
router.delete("/:productId",sellerMiddleware, ProductController.deleteProduct)
router.patch("/:productId",sellerMiddleware, ProductController.updateProduct)


module.exports = router;