const { default: mongoose, Schema } = require("mongoose");
const OrderStatus = require("../Domain/OrderStatus.js");
const PaymentStatus = require("../Domain/PaymentStatus.js");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    orderItems:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
    }],
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    totalMrpPrice: {
        type: Number,
        required: true
    },
    totalSellingPrice: {
        type: Number
    },
     discount: {
        type: Number
    },
     orderStatus: {
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.PENDING
    },
    totalItems:{
        type: Number,
        required: true
    },
    paymentStatus:{
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING
    },
    orderDate:{
        type: Date,
        default: Date.now
    },
    deliveryDate:{
        type: Date,
        default: function(){
            return Date.now() + 7 * 24 *60 * 60 *1000
        }
    },
  
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)
module.exports = Order;