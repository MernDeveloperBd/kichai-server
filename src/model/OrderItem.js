const { Schema, default: mongoose } = require("mongoose");

const orderItemSchema = new Schema({
       product:{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    size:{
        type: String
    },
    quantity:{
        type: Number,
        required: true,
        default: 1
    },
    mrpPrice:{
        type: Number,
        required: true
    },
    sellingPrice:{
        type: Number
    },
    userId:{
        type: String,
        required: true
    }
})

const OrderItem = mongoose.model('OrderItem', orderItemSchema)
module.exports = OrderItem;