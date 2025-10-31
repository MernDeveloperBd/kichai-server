const { default: mongoose, Schema } = require("mongoose");

const CartSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartItems:[{
        type: Schema.Types.ObjectId,
        ref: 'CartItem',
    }],
    totalSellingPrice: {
        type: Number,
        default: 0
    },
    totalItem: {
        type: Number,
        default: 0
    },
    totalMrpPrice: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    couponCode: {
        type: String,
        default: null
    },
    couponPrice: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const CartModel = mongoose.model('Cart', CartSchema)
module.exports = CartModel;