const { Schema } = require("mongoose");

const cartItemSchema = new Schema({
    cart:{
        type: Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    product:{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
})

const CartItem = mongoose.model('CartItem', cartItemSchema)
module.exports = CartItem;