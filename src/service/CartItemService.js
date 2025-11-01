const CartItem = require("../model/cart/CartItem.js");

class CartItemService {
    async removeCartItem(userId, cartItemId) {
        const cartItem = await this.findCartItemById(cartItemId);
        if (cartItem.userId.toString() === userId.toString()) {
            await CartItem.deleteOne({ _id: cartItem._id })
        } else {
            throw new Error("Unauthorized access")
        }
    }

    // update cart items
    async updateCartItem(userId, cartItemId, cartItemData) {
        const cartItem = await this.findCartItemById(cartItemId)
        if (cartItem.userId.toString() === userId.toString()) {
            const updated = {
                quantity: cartItemData.quantity,
                mrpPrice: cartItemData.quantity * cartItem.product.mrpPrice,
                sellingPrice: cartItemData.quantity * cartItem.product.sellingPrice,
            }
            return await CartItem.findByIdAndUpdate(cartItemId, updated, { new: true }).populate('product')
        } else {
            throw new Error("Unauthorized access")
        }
    }

    // find cart item by id
    async findCartItemById(cartItemId) {
        const cartItem = await CartItem.findById(cartItemId).populate('product')
        if (!cartItem) {
            throw new Error("Cart item no found")
        }
        return cartItem;
    }
}

module.exports = new CartItemService()